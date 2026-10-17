import React, { useState, useEffect } from 'react';
import { 
  Award, ShieldCheck, CheckCircle2, Printer, 
  X, ExternalLink, QrCode, Calendar, Clock, Sparkles,
  FileCheck, BadgeCheck, ZoomIn, ZoomOut, RotateCcw,
  Upload, Plus, Trash2, FileText, AlertCircle, RefreshCw
} from 'lucide-react';
import { Language } from '../data/i18n';
import { CANDIDATE_PROFILE } from '../data/candidateData';
import { CertificateItem, INITIAL_CERTIFICATES } from '../data/certificateStore';
import { 
  getVaultCertificates, 
  saveCertificateDocument, 
  addVaultCertificate, 
  deleteVaultCertificate, 
  subscribeToVault, 
  formatBytes 
} from '../data/documentVault';
import { AddCertificateModal } from './AddCertificateModal';
import { AuthenticDocumentViewer } from './AuthenticDocumentViewer';
import { printElementDirectly } from '../utils/printHelper';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  initialDoc?: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  initialDoc = 'ai-uab'
}) => {
  const [certificates, setCertificates] = useState<CertificateItem[]>(INITIAL_CERTIFICATES);
  const normalizedInitialId = initialDoc === 'ai-cert' ? 'ai-uab' : initialDoc === 'digcomp' ? 'digcomp-l6' : initialDoc;
  const [activeId, setActiveId] = useState<string>(normalizedInitialId || 'ai-uab');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const loadCerts = async () => {
    const list = await getVaultCertificates();
    setCertificates(list);
    if (initialDoc && list.some(c => c.id === initialDoc || (initialDoc === 'ai-cert' && c.id === 'ai-uab') || (initialDoc === 'digcomp' && c.id === 'digcomp-l6'))) {
      const target = list.find(c => c.id === initialDoc || (initialDoc === 'ai-cert' && c.id === 'ai-uab') || (initialDoc === 'digcomp' && c.id === 'digcomp-l6'));
      if (target) setActiveId(target.id);
    } else if (list.length > 0 && !list.some(c => c.id === activeId)) {
      setActiveId(list[0].id);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCerts();
    }
  }, [isOpen, initialDoc]);

  useEffect(() => {
    const unsubscribe = subscribeToVault(() => {
      if (isOpen) {
        loadCerts();
      }
    });
    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const currentCert = certificates.find(c => c.id === activeId) || certificates[0];
  const localizedTitle = (cert: CertificateItem) => {
    if (cert.id === 'ai-uab') {
      if (currentLang === 'fr') return 'IA et apprentissage : comprendre, utiliser et évaluer';
      if (currentLang === 'en') return 'AI and Learning: Understand, Use and Evaluate';
      return 'A Inteligência Artificial e a Aprendizagem: Compreender, Utilizar e Avaliar';
    }
    if (cert.id === 'digcomp-l6') {
      if (currentLang === 'fr') return 'Rapport de compétences numériques — DigComp 2.2 (niveau avancé 6)';
      if (currentLang === 'en') return 'European Digital Competence Framework (DigComp 2.2) - Advanced Level 6';
      return 'Relatório de Competências Digitais — DigComp 2.2 (Nível Avançado 6)';
    }
    return currentLang === 'fr' ? (cert.titleFr || cert.titleEn || cert.title)
      : currentLang === 'en' ? (cert.titleEn || cert.title)
      : cert.title;
  };

  const handleFileUploadForCurrent = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentCert) return;

    setIsUploading(true);
    try {
      await saveCertificateDocument(currentCert.id, file);
      await loadCerts();
    } catch (err) {
      console.error('Failed to save certificate document:', err);
      const message = currentLang === 'pt'
        ? 'Não foi possível atualizar o certificado online. O ficheiro anterior foi mantido. Verifica o acesso de administrador e tenta novamente.'
        : currentLang === 'fr'
          ? 'Impossible de mettre à jour le certificat en ligne. Le fichier précédent a été conservé. Vérifiez l’accès administrateur et réessayez.'
          : 'Could not update the certificate online. The previous file was kept. Check administrator access and try again.';
      const detail = err instanceof Error ? err.message : '';
      window.alert(detail ? `${message}\n\n${detail}` : message);
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleAddCertificate = async (newCert: CertificateItem, file?: File) => {
    await addVaultCertificate(newCert, file);
    await loadCerts();
    setActiveId(newCert.id);
  };

  const handleDeleteCertificate = async (id: string) => {
    if (window.confirm(currentLang === 'pt' ? 'Tem a certeza que deseja remover este certificado?' : 'Are you sure you want to remove this certificate?')) {
      await deleteVaultCertificate(id);
      await loadCerts();
    }
  };



  const handlePrint = () => {
    printElementDirectly('cert-content-container', currentCert?.title || 'Certificado Oficial');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-5 animate-in fade-in duration-200">
      
      {/* Hidden file input for uploading authentic PDF for current certificate */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,image/png,image/jpeg,image/webp"
        onChange={handleFileUploadForCurrent}
        className="hidden"
      />

      {/* Container Dialog */}
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden">
        
        {/* Modal Top Control Bar (No Print) */}
        <div className="no-print flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>{currentLang === 'pt' ? 'Visualizador de Certificados Oficiais' : 'Official Certificates Viewer'}</span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <BadgeCheck className="w-3 h-3" />
                  {currentLang === 'pt' ? 'Documento autêntico' : currentLang === 'fr' ? 'Document authentique' : 'Authentic Document'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {currentLang === 'pt' ? 'Dossiê em nome de Martina Morais da Silva' : 'Credentials for Martina Morais da Silva'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-700/80 hover:bg-emerald-900/80 rounded-lg transition-colors cursor-pointer"
              title={currentCert?.customUploadedPdfUrl ? 'Substituir ficheiro deste certificado' : 'Carregar o ficheiro PDF original'}
            >
              {isUploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>
                {currentCert?.customUploadedPdfUrl 
                  ? (currentLang === 'pt' ? 'Substituir Ficheiro' : currentLang === 'fr' ? 'Remplacer le fichier' : 'Replace File') 
                  : (currentLang === 'pt' ? 'Carregar o meu PDF' : currentLang === 'fr' ? 'Charger mon PDF' : 'Upload Real PDF')}
              </span>
            </button>

            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{currentLang === 'pt' ? 'Imprimir' : 'Print'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher for Certificates with Add Button */}
        <div className="no-print flex items-center border-b border-slate-800 bg-slate-900/60 px-4 py-2.5 gap-2 overflow-x-auto">
          {certificates.map((cert, index) => (
            <button
              key={cert.id}
              onClick={() => setActiveId(cert.id)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeId === cert.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>{index + 1}. {localizedTitle(cert).length > 30 ? localizedTitle(cert).substring(0, 30) + '...' : localizedTitle(cert)}</span>
              {cert.customUploadedPdfUrl && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-900 text-emerald-300 font-mono">
                  Real
                </span>
              )}
            </button>
          ))}

          {/* Add Certificate Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-400 bg-blue-950/40 border border-blue-800/60 hover:bg-blue-900/50 rounded-lg transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{currentLang === 'pt' ? '+ Adicionar' : '+ Add'}</span>
          </button>

          {/* Delete custom cert button */}
          {currentCert?.isCustom && (
            <button
              onClick={() => handleDeleteCertificate(currentCert.id)}
              className="ml-auto p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded transition-colors cursor-pointer"
              title={currentLang === 'pt' ? 'Remover este certificado' : 'Remove this certificate'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Informative notice banner if authentic PDF is uploaded or not */}
        <div className="no-print px-5 py-2.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
          {currentCert?.customUploadedPdfUrl ? (
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                {currentLang === 'pt' 
                  ? `Ficheiro original ativo: "${currentCert.fileName || 'documento.pdf'}" (100% autêntico como está).` 
                  : `Viewing your authentic original file: "${currentCert.fileName || 'document.pdf'}"`}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                {currentLang === 'pt'
                  ? 'Carregue aqui o ficheiro PDF ou imagem para que apareça exatamente como o seu documento é!'
                  : 'Upload your authentic PDF or image file to display it natively!'}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 text-xs font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              {currentCert?.customUploadedPdfUrl 
                ? (currentLang === 'pt' ? 'Substituir Ficheiro' : currentLang === 'fr' ? 'Remplacer le fichier' : 'Replace File') 
                : (currentLang === 'pt' ? 'Carregar Ficheiro Oficial' : currentLang === 'fr' ? 'Charger le document officiel' : 'Upload Official File')}
            </button>
          </div>
        </div>

        {/* Modal Body Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/70 flex justify-center items-start">
          
          {currentCert?.customUploadedPdfUrl ? (
            /* EMBED ACTUAL ORIGINAL DOCUMENT AS IT IS VIA AUTHENTIC CANVAS VIEWER */
            <div id="cert-content-container" className="w-full max-w-4xl">
              <AuthenticDocumentViewer
                dataUrl={currentCert.customUploadedPdfUrl}
                title={localizedTitle(currentCert)}
                fileName={currentCert.fileName}
                onReplace={() => fileInputRef.current?.click()}
                lang={currentLang}
              />
            </div>
          ) : (
            /* UPLOAD DROPZONE & INFORMATIVE CARD */
            <div 
              id="cert-content-container"
              className="w-full max-w-4xl bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-10 shadow-2xl space-y-6"
            >
              <div className="p-8 rounded-2xl border-2 border-dashed border-blue-500/40 bg-gradient-to-br from-blue-950/20 via-slate-900 to-slate-950 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
                  <FileText className="w-7 h-7" />
                </div>

                <div className="space-y-1.5 max-w-lg mx-auto">
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    {currentCert?.title}
                  </h4>
                  <p className="text-xs text-slate-300">
                    {currentLang === 'pt'
                      ? 'Carregue aqui o ficheiro PDF ou imagem original deste certificado para que os recrutadores possam visualizá-lo e descarregá-lo exatamente como ele é. Pode substituí-lo a qualquer momento.'
                      : 'Upload your original PDF or image file for recruiters to inspect and download as it is.'}
                  </p>
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>{currentLang === 'pt' ? 'Carregar Ficheiro Original (PDF / Imagem)' : 'Upload Original File (PDF / Image)'}</span>
                </button>
              </div>

              {/* Data specs */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800 pb-2">
                  <span className="text-slate-400">{currentLang === 'pt' ? 'Entidade:' : 'Institution:'}</span>
                  <span className="font-semibold text-white">{currentCert?.institution}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800 pb-2">
                  <span className="text-slate-400">{currentLang === 'pt' ? 'Conclusão / Nível:' : 'Completion / Level:'}</span>
                  <span className="font-semibold text-blue-400">{currentCert?.durationOrLevel} · {currentCert?.completionDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">{currentLang === 'pt' ? 'Descrição:' : 'Description:'}</span>
                  <p className="text-slate-300 leading-relaxed">{currentCert?.description}</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Add Custom Certificate Modal */}
      <AddCertificateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCertificate}
        currentLang={currentLang}
      />

    </div>
  );
};
