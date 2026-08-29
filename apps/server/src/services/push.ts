import http2 from 'http2';
import { createSign } from 'crypto';
import { config } from '../config.js';
import { getSupabase } from '../db/client.js';
import { logger } from '../logger.js';

// Cache the JWT — APNs tokens are valid for 1 hour, regenerate every 55 min
let cachedToken: { value: string; generatedAt: number } | null = null;

function getAPNsJWT(): string {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && now - cachedToken.generatedAt < 3300) {
    return cachedToken.value;
  }

  const header  = Buffer.from(JSON.stringify({ alg: 'ES256', kid: config.APNS_KEY_ID })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ iss: config.APNS_TEAM_ID, iat: now })).toString('base64url');

  const sign = createSign('SHA256');
  sign.update(`${header}.${payload}`);
  const sig = sign.sign({ key: config.APNS_KEY, dsaEncoding: 'ieee-p1363' }).toString('base64url');

  const value = `${header}.${payload}.${sig}`;
  cachedToken = { value, generatedAt: now };
  return value;
}

let http2Client: http2.ClientHttp2Session | null = null;

function getClient(): http2.ClientHttp2Session {
  if (!http2Client || http2Client.destroyed) {
    const host = config.APNS_SANDBOX
      ? 'https://api.sandbox.push.apple.com'
      : 'https://api.push.apple.com';
    logger.info({ host, sandbox: config.APNS_SANDBOX }, 'APNs connecting to host');
    http2Client = http2.connect(host);
    http2Client.on('error', (err) => {
      logger.error({ err }, 'APNs HTTP/2 connection error');
      http2Client = null;
    });
  }
  return http2Client;
}

async function sendToDevice(
  deviceToken: string,
  title: string,
  body: string,
  data?: Record<string, unknown>
): Promise<void> {
  return new Promise((resolve, reject) => {
    const client  = getClient();
    const jwt     = getAPNsJWT();
    const payload = JSON.stringify({
      aps: { alert: { title, body }, badge: 1, sound: 'default' },
      ...data,
    });

    logger.info({ token: deviceToken.slice(-8), bundleId: config.APNS_BUNDLE_ID }, 'APNs sending push');

    const req = client.request({
      ':method':        'POST',
      ':path':          `/3/device/${deviceToken}`,
      authorization:    `bearer ${jwt}`,
      'apns-topic':     config.APNS_BUNDLE_ID,
      'apns-push-type': 'alert',
      'apns-priority':  '10',
      'content-type':   'application/json',
      'content-length': Buffer.byteLength(payload),
    });

    let statusCode = 0;
    let responseBody = '';
    req.on('response', (headers) => { statusCode = headers[':status'] as number; });
    req.on('data', (chunk) => { responseBody += chunk; });
    req.on('end', () => {
      if (statusCode === 200) {
        logger.info({ token: deviceToken.slice(-8) }, 'APNs push delivered OK');
        resolve();
      } else {
        logger.error(`APNs push rejected — status=${statusCode} reason=${responseBody} token=...${deviceToken.slice(-8)}`);
        reject(new Error(`APNs ${statusCode}: ${responseBody}`));
      }
    });
    req.on('error', (err) => {
      logger.error({ err, token: deviceToken.slice(-8) }, 'APNs request error');
      reject(err);
    });
    req.write(payload);
    req.end();
  });
}

export async function sendPushToOrg(
  orgId: string,
  title: string,
  body: string,
  data?: Record<string, unknown>
): Promise<void> {
  if (!config.APNS_KEY_ID) {
    logger.warn('sendPushToOrg called but APNS_KEY_ID not configured');
    return;
  }

  logger.info({ orgId }, 'sendPushToOrg called');

  try {
    const { data: rows } = await getSupabase()
      .from('device_tokens')
      .select('token')
      .eq('organization_id', orgId);

    logger.info({ orgId, tokenCount: rows?.length ?? 0 }, 'APNs device tokens found');

    if (!rows?.length) return;

    const results = await Promise.allSettled(
      rows.map((r) => sendToDevice(r.token, title, body, data))
    );

    const failed = results.filter((r) => r.status === 'rejected').length;
    if (failed) logger.warn({ failed, total: rows.length }, 'Some APNs pushes failed');
    else logger.info({ total: rows.length }, 'All APNs pushes sent');
  } catch (err) {
    logger.error({ err }, 'sendPushToOrg error');
  }
}
