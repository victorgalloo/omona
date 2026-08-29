import makeWASocket, {
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  fetchLatestBaileysVersion,
  DisconnectReason,
  isLidUser,
  jidDecode,
  type WASocket,
} from 'baileys';
import { Boom } from '@hapi/boom';
import path from 'node:path';
import fs from 'node:fs';
import dns from 'node:dns';
import { config } from '../config.js';
import * as db from '../db/queries.js';
import { getSupabase } from '../db/client.js';
import { qrManager } from './qr-manager.js';
import { handleIncomingMessage } from './message-handler.js';
import { logger } from '../logger.js';

async function transcribeAudio(buffer: Buffer): Promise<string | null> {
  const GROQ_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_KEY) {
    logger.warn('GROQ_API_KEY not set, skipping audio transcription');
    return null;
  }
  
  const formData = new FormData();
  formData.append('file', new Blob([new Uint8Array(buffer)], { type: 'audio/ogg' }), 'audio.ogg');
  formData.append('model', 'whisper-large-v3');
  formData.append('language', 'es');

  const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${GROQ_KEY}` },
    body: formData,
  });

  if (!res.ok) {
    logger.warn({ status: res.status }, 'Whisper transcription failed');
    return null;
  }

  const data = await res.json() as { text?: string };
  return data.text || null;
}

// Force IPv4 — IPv6 is broken on this machine
dns.setDefaultResultOrder('ipv4first');

const activeSockets = new Map<string, WASocket>();
const reconnectAttempts = new Map<string, number>();
const MAX_RECONNECT_ATTEMPTS = 5;

function getAuthDir(orgId: string): string {
  return path.resolve(config.BAILEYS_AUTH_DIR, orgId);
}

export const sessionManager = {
  getSocket(orgId: string): WASocket | undefined {
    return activeSockets.get(orgId);
  },

  async connect(orgId: string): Promise<void> {
    if (activeSockets.has(orgId)) return;
    logger.info({ orgId }, 'Starting WhatsApp connection...');

    const authDir = getAuthDir(orgId);
    fs.mkdirSync(authDir, { recursive: true });

    // Use Supabase-backed auth state (survives Railway deploys)
    const { useSupabaseAuthState } = await import('./supabase-auth-state.js');
    const { state, saveCreds } = await useSupabaseAuthState(orgId);

    // Fetch real WA Web version (like OpenClaw does)
    const { version } = await fetchLatestBaileysVersion();
    logger.info({ orgId, authDir, hasCreds: !!state.creds.me, version }, 'Creating WASocket...');
    const socket = makeWASocket({
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger as any),
      },
      version,
      browser: ['Omona', 'Chrome', '1.0.0'],
      syncFullHistory: false,
      markOnlineOnConnect: false,
      logger: logger as any,
    });
    logger.info({ orgId }, 'WASocket created, waiting for events...');

    activeSockets.set(orgId, socket);
    socket.ev.on('creds.update', saveCreds);

    socket.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;
      // Log every connection update for debugging
      console.log('[WA-DEBUG] connection.update:', JSON.stringify({ connection, qr: qr ? `${qr.length} chars` : null, error: lastDisconnect?.error?.message, stack: lastDisconnect?.error?.stack?.split('\n')[0] }));

      if (qr) {
        logger.info({ orgId, qrLength: qr.length }, 'QR code received!');
        await qrManager.saveQR(orgId, qr);
      }

      if (connection === 'close') {
        activeSockets.delete(orgId);
        const boom = lastDisconnect?.error as Boom | undefined;
        const statusCode = boom?.output?.statusCode ?? 0;
        const errorMsg = boom?.message || lastDisconnect?.error?.message || 'Unknown';
        const errorStack = lastDisconnect?.error?.stack || boom?.stack || '';
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

        // Detect specific error conditions and store reason for UI
        let disconnectReason = 'unknown';
        if (statusCode === DisconnectReason.loggedOut) {
          disconnectReason = 'logged_out';
        } else if (statusCode === DisconnectReason.connectionReplaced) {
          disconnectReason = 'connection_replaced';
        } else if (statusCode === 440 || errorMsg.includes('too many')) {
          disconnectReason = 'too_many_devices';
        } else if (statusCode === 408 || statusCode === 500) {
          disconnectReason = 'timeout';
        }

        logger.info({ orgId, statusCode, errorMsg, disconnectReason, shouldReconnect }, 'WhatsApp connection closed');

        // Save disconnect reason for dashboard
        if (!shouldReconnect || disconnectReason === 'too_many_devices' || disconnectReason === 'connection_replaced') {
          await db.upsertWhatsAppSession(orgId, {
            status: 'disconnected',
            metadata: { disconnect_reason: disconnectReason, error: errorMsg, at: new Date().toISOString() },
          });
        }

        if (shouldReconnect) {
          const attempts = reconnectAttempts.get(orgId) ?? 0;
          if (attempts < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempts.set(orgId, attempts + 1);
            const delay = Math.min(1000 * Math.pow(2, attempts), 30000);
            logger.info({ orgId, attempt: attempts + 1, delay }, 'Reconnecting...');
            setTimeout(() => sessionManager.connect(orgId), delay);
          } else {
            logger.warn({ orgId }, 'Max reconnect attempts reached');
            await db.upsertWhatsAppSession(orgId, { status: 'disconnected' });
            reconnectAttempts.delete(orgId);
          }
        } else {
          await db.upsertWhatsAppSession(orgId, { status: 'disconnected', qr_code: null });
          // Clear auth state from DB + filesystem on logout
          await getSupabase().from('whatsapp_sessions').update({ auth_creds: null, auth_keys: {} }).eq('organization_id', orgId);
          reconnectAttempts.delete(orgId);
          try { fs.rmSync(authDir, { recursive: true, force: true }); } catch {}
        }
      }

      if (connection === 'open') {
        reconnectAttempts.delete(orgId);
        await qrManager.clearQR(orgId);
        const phoneNumber = socket.user?.id?.split(':')[0] ?? null;
        await db.upsertWhatsAppSession(orgId, {
          status: 'connected',
          phone_number: phoneNumber ? `+${phoneNumber}` : null,
          qr_code: null,
        });
        logger.info({ orgId, phoneNumber }, 'WhatsApp connected');
      }
    });

    socket.ev.on('messages.upsert', async (upsert) => {
      if (upsert.type !== 'notify') return;
      const agentConfig = await db.getAgentConfig(orgId);
      if (!agentConfig) return;

      for (const msg of upsert.messages) {
        if (msg.key.fromMe) continue;
        let text = msg.message?.conversation ?? msg.message?.extendedTextMessage?.text ?? null;
        if (!text) {
          if (msg.message?.imageMessage) text = '[El cliente envió una imagen]';
          else if (msg.message?.audioMessage) {
            try {
              const { downloadMediaMessage } = await import('baileys');
              const buffer = await downloadMediaMessage(msg, 'buffer', {}) as Buffer;
              const transcription = await transcribeAudio(buffer);
              text = transcription || '[El cliente envió un audio (no se pudo transcribir)]';
            } catch (e) {
              logger.warn({ error: e }, 'Failed to transcribe audio');
              text = '[El cliente envió un audio]';
            }
          }
          else if (msg.message?.videoMessage) text = '[El cliente envió un video]';
          else if (msg.message?.documentMessage) text = `[El cliente envió un documento: ${msg.message.documentMessage.fileName || 'archivo'}]`;
          else if (msg.message?.stickerMessage) text = '[Sticker]';
          else if (msg.message?.contactMessage) text = `[El cliente compartió un contacto: ${msg.message.contactMessage.displayName || 'contacto'}]`;
          else if (msg.message?.locationMessage) text = '[El cliente compartió una ubicación]';
        }
        if (!text) continue;
        const jid = msg.key.remoteJid;
        if (!jid || jid.endsWith('@g.us')) continue;

        // Resolve phone number from JID — Baileys v7 may use LID JIDs instead of phone numbers
        let phoneNumber: string | null = null;
        if (isLidUser(jid)) {
          // Try remoteJidAlt first (Baileys provides the PN JID as alternative)
          const altJid = msg.key.remoteJidAlt;
          if (altJid && !isLidUser(altJid)) {
            const decoded = jidDecode(altJid);
            if (decoded?.user) phoneNumber = `+${decoded.user}`;
          }
          // Fall back to LID mapping store
          if (!phoneNumber) {
            try {
              const pnJid = await socket.signalRepository.lidMapping.getPNForLID(jid);
              if (pnJid) {
                const decoded = jidDecode(pnJid);
                if (decoded?.user) phoneNumber = `+${decoded.user}`;
              }
            } catch (err) {
              logger.warn({ err, jid, orgId }, 'Failed to resolve LID to phone number via mapping');
            }
          }
          if (!phoneNumber) {
            logger.warn({ jid, orgId, msgId: msg.key.id }, 'Could not resolve LID to phone number, skipping message');
            continue;
          }
        } else {
          const decoded = jidDecode(jid);
          phoneNumber = decoded?.user ? `+${decoded.user}` : null;
          if (!phoneNumber) continue;
        }

        try { await socket.presenceSubscribe(jid); await socket.sendPresenceUpdate('composing', jid); } catch {}

        await handleIncomingMessage(
          { orgId, phoneNumber, contactName: msg.pushName ?? undefined, messageText: text, whatsappMessageId: msg.key.id ?? '', whatsappJid: jid },
          agentConfig,
          async (_to, reply) => { await socket.sendMessage(jid, { text: reply }); }
        );

        try { await socket.sendPresenceUpdate('paused', jid); } catch {}
      }
    });

    socket.ev.on('message-receipt.update', async (updates) => {
      for (const { key, receipt } of updates) {
        logger.debug({ messageId: key.id, receipt }, 'Message receipt update');
      }
    });

    await db.upsertWhatsAppSession(orgId, { status: 'connecting' });
  },

  async disconnect(orgId: string): Promise<void> {
    const socket = activeSockets.get(orgId);
    if (socket) { await socket.logout(); activeSockets.delete(orgId); }
    reconnectAttempts.delete(orgId);
    await db.upsertWhatsAppSession(orgId, { status: 'disconnected', qr_code: null });
  },

  async sendMessage(orgId: string, phoneNumber: string, text: string, jid?: string): Promise<void> {
    let socket = activeSockets.get(orgId);

    // Auto-reconnect if socket is missing but DB says connected (e.g. after server restart)
    if (!socket) {
      const session = await db.getWhatsAppSession(orgId);
      if (session?.status === 'connected' || session?.status === 'connecting') {
        logger.info({ orgId }, 'Socket missing but session active in DB — auto-reconnecting');
        await sessionManager.connect(orgId);
        for (let i = 0; i < 30; i++) {
          socket = activeSockets.get(orgId);
          if (socket) break;
          await new Promise((r) => setTimeout(r, 500));
        }
      }
      if (!socket) throw new Error('No active WhatsApp connection');
    }

    const targetJid = jid || (phoneNumber.replace('+', '') + '@s.whatsapp.net');
    logger.debug({ orgId, phoneNumber, jid, targetJid }, 'Sending WhatsApp message');
    await socket.sendMessage(targetJid, { text });
  },
};
