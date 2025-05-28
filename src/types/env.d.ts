// src/types/env.d.ts
export {}; // Needed to make this a module

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URI: string;
      JWT_SECRET: string;
      PORT?: string;
    }
  }
}
