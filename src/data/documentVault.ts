/**
 * Document & Certificate Vault
 * Uses IndexedDB for reliable, persistent storage of authentic PDFs and images of any size,
 * avoiding localStorage 5MB quota errors. Synchronizes with memory cache and dispatches events.
 */

import { CertificateItem, INITIAL_CERTIFICATES } from './certificateStore';
import { uploadPortfolioFile, deletePortfolioFile, fetchPortfolioFileDataUrl, loadCloudCertificates, saveCloudCertificates } from './portfolioCloud';

export interface StoredDocument {
  id: string; // 'uploaded_cv' | 'uploaded_letter' | certId
  name: string;
  dataUrl: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

const DB_NAME = 'martina_portfolio_vault_v1';
const DB_VERSION = 1;
const STORE_NAME = 'vault_documents';
const EVENT_NAME = 'martina_vault_updated';

// In-memory cache for ultra-fast synchronous initial renders
const memoryCache: Record<string, StoredDocument> = {};
let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });

  return dbPromise;
}

// Subscribe to document updates
export function subscribeToVault(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}

function notifyVaultUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  }
}

// File to Data URL helper
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Convert dataUrl to Blob
export function dataUrlToBlob(dataUrl: string): Blob {
  if (dataUrl.startsWith('blob:')) {
    // Already blob, return an empty placeholder or throw
    return new Blob([], { type: 'application/pdf' });
  }
  const parts = dataUrl.split(';base64,');
  const contentType = parts[0].replace('data:', '') || 'application/pdf';
  const base64Data = parts[1] || '';
  const raw = window.atob(base64Data);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: contentType });
}

export function createBlobUrlFromDataUrl(dataUrl: string): string {
  if (!dataUrl) return '';
  if (dataUrl.startsWith('blob:')) return dataUrl;
  try {
    const blob = dataUrlToBlob(dataUrl);
    return URL.createObjectURL(blob);
  } catch (err) {
    console.warn('Failed to create blob url:', err);
    return dataUrl;
  }
}

// Download helper
export function downloadFileFromUrl(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Format file size
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/* =====================================================================
   CV DOCUMENT API
   ===================================================================== */

export async function getUploadedCV(): Promise<StoredDocument | null> {
  // Always check Cloudflare first so this browser cannot keep showing an older local copy.
  try {
    const remoteDataUrl = await fetchPortfolioFileDataUrl('uploaded_cv');
    if (remoteDataUrl) {
      const remoteDoc: StoredDocument = {
        id: 'uploaded_cv',
        name: 'CV_Martina_Morais_da_Silva.pdf',
        dataUrl: remoteDataUrl,
        mimeType: remoteDataUrl.startsWith('data:application/pdf') ? 'application/pdf' : 'application/octet-stream',
        size: Math.round(remoteDataUrl.length * 0.75),
        uploadedAt: new Date().toISOString(),
      };
      memoryCache['uploaded_cv'] = remoteDoc;
      try {
        const db = await getDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(remoteDoc);
      } catch { /* shared copy remains available */ }
      return remoteDoc;
    }
  } catch (err) {
    console.warn('Could not load shared CV from Cloudflare; checking local fallback', err);
  }

  if (memoryCache['uploaded_cv']) return memoryCache['uploaded_cv'];
  try {
    const db = await getDB();
    const localDoc = await new Promise<StoredDocument | null>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get('uploaded_cv');
      req.onsuccess = () => resolve((req.result as StoredDocument | undefined) || null);
      req.onerror = () => resolve(null);
    });
    if (localDoc) {
      memoryCache['uploaded_cv'] = localDoc;
      return localDoc;
    }
  } catch (err) {
    console.warn('Local CV vault unavailable', err);
  }
  const legacyUrl = localStorage.getItem('candidate_cv_pdf');
  if (!legacyUrl) return null;
  const legacyDoc: StoredDocument = {
    id: 'uploaded_cv',
    name: localStorage.getItem('candidate_cv_pdf_name') || 'CV_Martina_Morais_da_Silva.pdf',
    dataUrl: legacyUrl,
    mimeType: 'application/pdf',
    size: Math.round(legacyUrl.length * 0.75),
    uploadedAt: new Date().toISOString(),
  };
  memoryCache['uploaded_cv'] = legacyDoc;
  return legacyDoc;
}

export async function saveUploadedCV(file: File): Promise<StoredDocument> {
  const dataUrl = await fileToDataUrl(file);
  const doc: StoredDocument = {
    id: 'uploaded_cv',
    name: file.name,
    dataUrl,
    mimeType: file.type || 'application/pdf',
    size: file.size,
    uploadedAt: new Date().toISOString()
  };

  // Upload first so a failed cloud write cannot masquerade as a successful shared update.
  await uploadPortfolioFile('uploaded_cv', file);
  memoryCache['uploaded_cv'] = doc;

  // Try saving in IndexedDB
  try {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(doc);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB save failed for CV, using localStorage fallback', err);
    try {
      localStorage.setItem('candidate_cv_pdf', dataUrl);
      localStorage.setItem('candidate_cv_pdf_name', file.name);
    } catch (e) {
      console.warn('LocalStorage quota exceeded', e);
    }
  }

  notifyVaultUpdate();
  return doc;
}

export async function removeUploadedCV(): Promise<void> {
  delete memoryCache['uploaded_cv'];
  await deletePortfolioFile('uploaded_cv');
  localStorage.removeItem('candidate_cv_pdf');
  localStorage.removeItem('candidate_cv_pdf_name');

  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete('uploaded_cv');
  } catch (err) {
    console.warn('Failed to delete CV from vault', err);
  }

  notifyVaultUpdate();
}

/* =====================================================================
   MOTIVATION LETTER DOCUMENT API
   ===================================================================== */

export async function getUploadedLetter(): Promise<StoredDocument | null> {
  // Always check Cloudflare first so another browser sees the latest shared document.
  try {
    const remoteDataUrl = await fetchPortfolioFileDataUrl('uploaded_letter');
    if (remoteDataUrl) {
      const remoteDoc: StoredDocument = {
        id: 'uploaded_letter',
        name: 'Carta_Motivacao_Martina_Morais_da_Silva.pdf',
        dataUrl: remoteDataUrl,
        mimeType: remoteDataUrl.startsWith('data:application/pdf') ? 'application/pdf' : 'application/octet-stream',
        size: Math.round(remoteDataUrl.length * 0.75),
        uploadedAt: new Date().toISOString(),
      };
      memoryCache['uploaded_letter'] = remoteDoc;
      try {
        const db = await getDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(remoteDoc);
      } catch { /* shared copy remains available */ }
      return remoteDoc;
    }
  } catch (err) {
    console.warn('Could not load shared motivation letter from Cloudflare; checking local fallback', err);
  }

  if (memoryCache['uploaded_letter']) return memoryCache['uploaded_letter'];
  try {
    const db = await getDB();
    const localDoc = await new Promise<StoredDocument | null>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get('uploaded_letter');
      req.onsuccess = () => resolve((req.result as StoredDocument | undefined) || null);
      req.onerror = () => resolve(null);
    });
    if (localDoc) {
      memoryCache['uploaded_letter'] = localDoc;
      return localDoc;
    }
  } catch (err) {
    console.warn('Local motivation letter vault unavailable', err);
  }
  const legacyUrl = localStorage.getItem('candidate_letter_pdf');
  if (!legacyUrl) return null;
  const legacyDoc: StoredDocument = {
    id: 'uploaded_letter',
    name: localStorage.getItem('candidate_letter_pdf_name') || 'Carta_Motivacao_Martina_Morais_da_Silva.pdf',
    dataUrl: legacyUrl,
    mimeType: 'application/pdf',
    size: Math.round(legacyUrl.length * 0.75),
    uploadedAt: new Date().toISOString(),
  };
  memoryCache['uploaded_letter'] = legacyDoc;
  return legacyDoc;
}

export async function saveUploadedLetter(file: File): Promise<StoredDocument> {
  const dataUrl = await fileToDataUrl(file);
  const doc: StoredDocument = {
    id: 'uploaded_letter',
    name: file.name,
    dataUrl,
    mimeType: file.type || 'application/pdf',
    size: file.size,
    uploadedAt: new Date().toISOString()
  };

  // Upload first so the local UI never reports a cloud update that failed.
  await uploadPortfolioFile('uploaded_letter', file);
  memoryCache['uploaded_letter'] = doc;

  try {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(doc);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB save failed for letter', err);
    try {
      localStorage.setItem('candidate_letter_pdf', dataUrl);
      localStorage.setItem('candidate_letter_pdf_name', file.name);
    } catch (e) {
      console.warn('LocalStorage quota exceeded', e);
    }
  }

  notifyVaultUpdate();
  return doc;
}

export async function removeUploadedLetter(): Promise<void> {
  delete memoryCache['uploaded_letter'];
  await deletePortfolioFile('uploaded_letter');
  localStorage.removeItem('candidate_letter_pdf');
  localStorage.removeItem('candidate_letter_pdf_name');

  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete('uploaded_letter');
  } catch (err) {
    console.warn('Failed to delete letter from vault', err);
  }

  notifyVaultUpdate();
}

/* =====================================================================
   CERTIFICATES VAULT API
   ===================================================================== */

const CERTS_META_KEY = 'martina_certs_meta_list_v2';

export async function getVaultCertificates(): Promise<CertificateItem[]> {
  // 1. Get metadata from localStorage or initial list
  let certsMeta: CertificateItem[] = INITIAL_CERTIFICATES;
  const cloudCertificates = await loadCloudCertificates();
  if (cloudCertificates && cloudCertificates.length > 0) certsMeta = cloudCertificates;
  try {
    const raw = localStorage.getItem(CERTS_META_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if ((!cloudCertificates || cloudCertificates.length === 0) && Array.isArray(parsed) && parsed.length > 0) {
        certsMeta = parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading certs metadata', err);
  }

  // 2. Prefer the shared cloud file so updates made in another browser are visible.
  // IndexedDB and memoryCache are only fallbacks; they may contain an older version.
  const hydrated = await Promise.all(certsMeta.map(async (cert): Promise<CertificateItem> => {
    const docId = `cert_${cert.id}`;

    try {
      const cloudDataUrl = await fetchPortfolioFileDataUrl(docId);
      if (cloudDataUrl) {
        const cloudDoc: StoredDocument = {
          id: docId,
          name: cert.fileName || `${cert.title}.pdf`,
          dataUrl: cloudDataUrl,
          mimeType: cloudDataUrl.startsWith('data:image') ? 'image/png' : 'application/pdf',
          size: Math.round(cloudDataUrl.length * 0.75),
          uploadedAt: new Date().toISOString()
        };
        memoryCache[docId] = cloudDoc;

        // Refresh this browser's local copy, without making local storage a requirement.
        try {
          const db = await getDB();
          await new Promise<void>((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const req = tx.objectStore(STORE_NAME).put(cloudDoc);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
          });
        } catch (err) {
          console.warn('Could not refresh local certificate cache from cloud', err);
        }

        return { ...cert, customUploadedPdfUrl: cloudDataUrl, fileName: cloudDoc.name };
      }
    } catch (err) {
      console.warn(`Could not load cloud certificate ${docId}; trying local fallback`, err);
    }

    // Fallback for files that exist only in this browser or while the cloud is unavailable.
    if (memoryCache[docId]) {
      return {
        ...cert,
        customUploadedPdfUrl: memoryCache[docId].dataUrl,
        fileName: memoryCache[docId].name
      };
    }

    try {
      const db = await getDB();
      const localDoc = await new Promise<StoredDocument | undefined>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const req = tx.objectStore(STORE_NAME).get(docId);
        req.onsuccess = () => resolve(req.result as StoredDocument | undefined);
        req.onerror = () => reject(req.error);
      });
      if (localDoc) {
        memoryCache[docId] = localDoc;
        return { ...cert, customUploadedPdfUrl: localDoc.dataUrl, fileName: localDoc.name };
      }
    } catch (err) {
      console.warn('Could not load local certificate fallback', err);
    }

    // Packaged originals are the guaranteed fallback, so the certificate viewer
    // opens the actual PDF even when Cloudflare KV has no uploaded copy.
    const bundledPdf = INITIAL_CERTIFICATES.find(item => item.id === cert.id)?.customUploadedPdfUrl;
    return bundledPdf ? { ...cert, customUploadedPdfUrl: bundledPdf } : cert;
  }));
  return hydrated;
}

export async function saveCertificateDocument(certId: string, file: File): Promise<StoredDocument> {
  const dataUrl = await fileToDataUrl(file);
  const docId = `cert_${certId}`;
  const doc: StoredDocument = {
    id: docId,
    name: file.name,
    dataUrl,
    mimeType: file.type || 'application/pdf',
    size: file.size,
    uploadedAt: new Date().toISOString()
  };

  // Upload to the shared source of truth first. Do not show a local-only update
  // as successful if the cloud upload fails (other browsers would still see the old file).
  await uploadPortfolioFile(docId, file);

  memoryCache[docId] = doc;

  // Save a local cache only after the cloud upload has succeeded.
  try {
    const db = await getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const req = tx.objectStore(STORE_NAME).put(doc);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB error saving certificate document', err);
  }

  // Update metadata fileName in list
  try {
    const currentList = await getVaultCertificates();
    const updated = currentList.map((c) => {
      if (c.id === certId) {
        return {
          ...c,
          fileName: file.name,
          customUploadedPdfUrl: dataUrl
        };
      }
      return c;
    });
    // Strip bulky dataUrl before saving metadata to localStorage
    const metaOnly = updated.map(({ customUploadedPdfUrl, ...rest }) => rest);
    localStorage.setItem(CERTS_META_KEY, JSON.stringify(metaOnly));
    await saveCloudCertificates(metaOnly);
  } catch (err) {
    console.warn('Error saving certs meta', err);
  }

  notifyVaultUpdate();
  return doc;
}

export async function addVaultCertificate(newCert: CertificateItem, file?: File): Promise<CertificateItem> {
  let fileDataUrl: string | undefined = newCert.customUploadedPdfUrl;
  let fileName: string | undefined = file ? file.name : newCert.fileName;

  if (file) {
    const savedDoc = await saveCertificateDocument(newCert.id, file);
    fileDataUrl = savedDoc.dataUrl;
    fileName = file.name;
  } else if (fileDataUrl) {
    // If we have dataUrl already (e.g. from AddCertificateModal)
    const docId = `cert_${newCert.id}`;
    const doc: StoredDocument = {
      id: docId,
      name: fileName || `${newCert.title}.pdf`,
      dataUrl: fileDataUrl,
      mimeType: fileDataUrl.startsWith('data:image') ? 'image/png' : 'application/pdf',
      size: Math.round(fileDataUrl.length * 0.75),
      uploadedAt: new Date().toISOString()
    };
    memoryCache[docId] = doc;
    try {
      const db = await getDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(doc);
    } catch (err) {
      console.warn('Error saving cert document to vault', err);
    }
  }

  const certToAdd: CertificateItem = {
    ...newCert,
    customUploadedPdfUrl: fileDataUrl,
    fileName: fileName,
    isCustom: true
  };

  try {
    const currentList = await getVaultCertificates();
    const updated = [...currentList.filter(c => c.id !== newCert.id), certToAdd];
    const metaOnly = updated.map(({ customUploadedPdfUrl, ...rest }) => rest);
    localStorage.setItem(CERTS_META_KEY, JSON.stringify(metaOnly));
    await saveCloudCertificates(metaOnly);
  } catch (err) {
    console.warn('Error adding certificate', err);
  }

  notifyVaultUpdate();
  return certToAdd;
}

export async function deleteVaultCertificate(certId: string): Promise<void> {
  const docId = `cert_${certId}`;
  delete memoryCache[docId];

  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(docId);
  } catch (err) {
    console.warn('Error deleting certificate document from IndexedDB', err);
  }

  try {
    const currentList = await getVaultCertificates();
    const updated = currentList.filter((c) => c.id !== certId);
    const metaOnly = updated.map(({ customUploadedPdfUrl, ...rest }) => rest);
    localStorage.setItem(CERTS_META_KEY, JSON.stringify(metaOnly));
    await saveCloudCertificates(metaOnly);
    await deletePortfolioFile(docId);
  } catch (err) {
    console.warn('Error deleting certificate meta', err);
  }

  notifyVaultUpdate();
}
