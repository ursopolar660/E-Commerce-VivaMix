/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Se você tiver outras variáveis .env, adicione-as aqui também
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}