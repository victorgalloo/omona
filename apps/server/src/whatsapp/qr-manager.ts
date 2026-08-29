import QRCode from 'qrcode';
import * as db from '../db/queries.js';
import { logger } from '../logger.js';

export const qrManager = {
  async saveQR(orgId: string, qrString: string): Promise<void> {
    try {
      const qrDataUrl = await QRCode.toDataURL(qrString, { width: 256, margin: 2 });
      await db.upsertWhatsAppSession(orgId, { qr_code: qrDataUrl, status: 'qr_pending' });
    } catch (error) {
      logger.error({ error, orgId }, 'Error generating QR');
    }
  },

  async clearQR(orgId: string): Promise<void> {
    await db.upsertWhatsAppSession(orgId, { qr_code: null });
  },

  async getQR(orgId: string): Promise<{ qr_code: string | null; status: string }> {
    const session = await db.getWhatsAppSession(orgId);
    return { qr_code: session?.qr_code ?? null, status: session?.status ?? 'disconnected' };
  },
};
