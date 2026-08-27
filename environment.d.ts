declare global {
  namespace NodeJS {
    interface ProcessEnv {
      POSTGRES_HOST: string;
      POSTGRES_PORT: number;
      POSTGRES_USER: string;
      POSTGRES_DB: string;
      POSTGRES_PASSWORD: string;
    }
  }
}

// Ensures this file is treated as a module, which is required for `declare global`.
export {};
