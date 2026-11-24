declare global {
  interface Window {
    __PORTFOLIO__?: {
      baseUrl: string;
      csrf: string;
      email: string;
      mailEnabled: boolean;
      staticSite?: boolean;
    };
  }
}
export const runtime = window.__PORTFOLIO__ || {
  baseUrl: new URL(import.meta.env.BASE_URL, location.origin).href.replace(
    /\/$/,
    "",
  ),
  csrf: "",
  email: "mhmmadindrra@gmail.com",
  mailEnabled: false,
  staticSite: import.meta.env.VITE_STATIC_SITE === "true",
};
export const basePath = new URL(runtime.baseUrl).pathname.replace(/\/$/, "");
export async function api<T>(
  path: string,
  method = "GET",
  data?: unknown,
): Promise<T> {
  const response = await fetch(`${runtime.baseUrl}/api/${path}`, {
    method,
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": runtime.csrf,
    },
    ...(data ? { body: JSON.stringify(data) } : {}),
    signal: AbortSignal.timeout(15000),
  });
  const body = await response.json();
  if (!response.ok)
    throw new Error(
      response.status === 419
        ? "Sesi berakhir. Muat ulang halaman lalu coba lagi."
        : response.status === 429
          ? "Terlalu banyak permintaan. Coba kembali sebentar lagi."
          : body.message || "Permintaan gagal. Silakan coba lagi.",
    );
  return body;
}
