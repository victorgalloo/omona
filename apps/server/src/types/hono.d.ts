import type { AuthContext } from '../api/middleware.js';

declare module 'hono' {
  interface ContextVariableMap {
    auth: AuthContext;
  }
}

export {};
