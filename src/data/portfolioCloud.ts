import type { CertificateItem } from './certificateStore';

const TOKEN_KEY = 'martina_portfolio_admin_token';
export function getPortfolioAdminToken(): string | null {
  let token = sessionStorage.getItem(TOKEN_KEY);
  if (!token) {
    token = window.prompt('Acesso de administrador: introduz a palavra-passe configurada como segredo PORTFOLIO_ADMIN_TOKEN no Cloudflare. Só é necessária para carregar, substituir ou remover ficheiros.');
    if (!token) return null;
    token = token.trim();
    if (!token) return null;
    sessionStorage.setItem(TOKEN_KEY, token);
  }
  return token;
}

async function adminFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = getPortfolioAdminToken();
  if (!token) throw new Error('Admin access cancelled.');
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(input, { ...init, headers });
  if (response.status === 401) {
    sessionStorage.removeItem(TOKEN_KEY);
    throw new Error('Acesso de administrador recusado. Confirma o segredo PORTFOLIO_ADMIN_TOKEN nas definições do Worker no Cloudflare e tenta novamente.');
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${response.status})`);
  }
  return response;
}

export async function uploadPortfolioFile(id: string, file: File) {
  const form = new FormData();
  form.set('file', file);
  return adminFetch(`/api/portfolio-file?id=${encodeURIComponent(id)}`, { method: 'POST', body: form });
}
export async function deletePortfolioFile(id: string) {
  return adminFetch(`/api/portfolio-file?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
}
export async function fetchPortfolioFileDataUrl(id: string): Promise<string | null> {
  const response = await fetch(`/api/portfolio-file?id=${encodeURIComponent(id)}`, { cache: 'no-store' });
  if (response.status === 404) return null;
  if (!response.ok) return null;
  const blob = await response.blob();
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
export async function fetchPortfolioFileBlob(id: string): Promise<Blob | null> {
  const response = await fetch(`/api/portfolio-file?id=${encodeURIComponent(id)}`, { cache: 'no-store' });
  if (response.status === 404 || !response.ok) return null;
  return response.blob();
}
export async function loadCloudCertificates(): Promise<CertificateItem[] | null> {
  try {
    const response = await fetch('/api/portfolio', { cache: 'no-store' });
    if (!response.ok) return null;
    const payload = await response.json();
    return Array.isArray(payload.certificates) ? payload.certificates as CertificateItem[] : null;
  } catch { return null; }
}
export async function saveCloudCertificates(certificates: CertificateItem[]) {
  const clean = certificates.map(({ customUploadedPdfUrl, ...rest }) => rest);
  await adminFetch('/api/portfolio', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ certificates: clean }) });
}
