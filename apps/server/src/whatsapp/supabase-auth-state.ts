/**
 * Supabase-backed auth state for Baileys.
 * Persists creds + keys to DB so WhatsApp sessions survive Railway deploys.
 */
import { proto } from 'baileys';
import { initAuthCreds, BufferJSON } from 'baileys';
import type { AuthenticationCreds, AuthenticationState, SignalDataTypeMap } from 'baileys';
import { getSupabase } from '../db/client.js';
import { logger } from '../logger.js';

const sb = () => getSupabase();

/** Reviver that handles both Buffer formats from JSON storage:
 *  - {type:'Buffer', data:'base64string'} (BufferJSON.replacer format)
 *  - {type:'Buffer', data:[1,2,3]} (plain JSON.stringify format)
 */
function bufferReviver(_key: string, value: any): any {
  if (value && typeof value === 'object' && value.type === 'Buffer' && value.data != null) {
    if (typeof value.data === 'string') {
      return Buffer.from(value.data, 'base64');
    }
    if (Array.isArray(value.data)) {
      return Buffer.from(value.data);
    }
  }
  return value;
}

export async function useSupabaseAuthState(orgId: string): Promise<{
  state: AuthenticationState;
  saveCreds: () => Promise<void>;
}> {
  // Load creds from DB
  const { data: session } = await sb()
    .from('whatsapp_sessions')
    .select('auth_creds, auth_keys')
    .eq('organization_id', orgId)
    .single();

  let creds: AuthenticationCreds;
  if (session?.auth_creds) {
    creds = JSON.parse(JSON.stringify(session.auth_creds), BufferJSON.reviver);
  } else {
    creds = initAuthCreds();
  }

  const keys: Record<string, any> = session?.auth_keys || {};

  const saveCreds = async () => {
    const serialized = JSON.parse(JSON.stringify(creds, BufferJSON.replacer));
    await sb()
      .from('whatsapp_sessions')
      .update({ auth_creds: serialized })
      .eq('organization_id', orgId);
  };

  const saveKeys = async () => {
    await sb()
      .from('whatsapp_sessions')
      .update({ auth_keys: keys })
      .eq('organization_id', orgId);
  };

  // Debounce key saves (they happen very frequently)
  let keysSaveTimer: ReturnType<typeof setTimeout> | null = null;
  const debouncedSaveKeys = () => {
    if (keysSaveTimer) clearTimeout(keysSaveTimer);
    keysSaveTimer = setTimeout(saveKeys, 2000);
  };

  return {
    state: {
      creds,
      keys: {
        get: (type: string, ids: string[]) => {
          const data: Record<string, any> = {};
          for (const id of ids) {
            const key = `${type}-${id}`;
            const value = keys[key];
            if (value) {
              if (type === 'app-state-sync-key') {
                data[id] = proto.Message.AppStateSyncKeyData.fromObject(value);
              } else {
                // Restore Buffers from JSON (handles both base64 and array formats)
                data[id] = JSON.parse(JSON.stringify(value), bufferReviver);
              }
            }
          }
          return data;
        },
        set: (data: Record<string, Record<string, any>>) => {
          for (const [type, entries] of Object.entries(data)) {
            for (const [id, value] of Object.entries(entries || {})) {
              const key = `${type}-${id}`;
              if (value) {
                // Serialize Buffers so they survive JSON storage in Supabase
                keys[key] = JSON.parse(JSON.stringify(value, BufferJSON.replacer));
              } else {
                delete keys[key];
              }
            }
          }
          debouncedSaveKeys();
        },
      },
    },
    saveCreds,
  };
}
