/**
 * ブラウザ(クライアントサイド)からAPIにアクセスするための公開URL。
 * Next.jsによってクライアントサイドのコードに埋め込まれる。
 */
export const PUBLIC_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

/**
 * Next.jsサーバー(サーバーサイド)からAPIにアクセスするための内部URL。
 * サーバーサイドでのみ使用される。
 * INTERNAL_API_BASE_URLを優先し、なければINTERNAL_API_URL、最後にPUBLIC_API_BASE_URLを使用
 */
export const INTERNAL_API_BASE_URL =
  process.env.INTERNAL_API_BASE_URL ||
  process.env.INTERNAL_API_URL ||
  PUBLIC_API_BASE_URL;
