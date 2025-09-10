/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // Add other environment variables here if you use them, e.g.
  // readonly VITE_ANALYTICS_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}