import React, { useState, useEffect } from 'react';
import { 
  Award, ShieldCheck, CheckCircle2, Printer, 
  Sparkles, Clock, Calendar, QrCode, BadgeCheck,
  FileCheck, ExternalLink, Upload, Plus, Trash2, 
  AlertCircle, RefreshCw, FileText
} from 'lucide-react';
import { CANDIDATE_PROFILE } from '../data/candidateData';
import { Language } from '../data/i18n';
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

interface CertificatesSectionProps {
  currentLang: Language;
}

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({ currentLang }) => {
  const [certificates, setCertificates] = useState<CertificateItem[]>(INITIAL_CERTIFICATES);
  const [selectedId, setSelectedId] = useState<string>('ai-uab');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const loadCertificates = async () => {
    const list = await getVaultCertificates();
    setCertificates(list);
    if (list.length > 0 && !list.some(c => c.id === selectedId)) {
      setSelectedId(list[0].id);
    }
  };

  useEffect(() => {
    loadCertificates();
    const unsubscribe = subscribeToVault(() => {
      loadCertificates();
    });
    return () => unsubscribe();
  }, []);

  const currentCert = certificates.find(c => c.id === selectedId) || certificates[0];
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentCert) return;

    setIsUploading(true);
    try {
      await saveCertificateDocument(currentCert.id, file);
      await loadCertificates();
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
    await loadCertificates();
    setSelectedId(newCert.id);
  };

  const handleDeleteCertificate = async (id: string) => {
    if (window.confirm(currentLang === 'pt' ? 'Tem a certeza que deseja remover este certificado?' : 'Are you sure you want to remove this certificate?')) {
      await deleteVaultCertificate(id);
      await loadCertificates();
    }
  };


  const handlePrint = () => {
    printElementDirectly('cert-section-target', currentCert?.title || 'Certificado Oficial');
  };

  return (
    <div className="space-y-8">
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,image/png,image/jpeg,image/webp"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Top Banner (No Print) */}
      <div className="no-print p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentLang === 'pt' ? 'Documentos Oficiais & Certificados Originais' : 'Official Credentials & Authentic Files'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {currentLang === 'pt' ? 'Certificados & Documentos Oficiais' : 'Official Certificates & Documents'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {currentLang === 'pt' 
              ? 'Consulte as descrições dos certificados oficiais em nome de Martina Morais da Silva. Pode visualizar as informações e adicionar mais certificados quando quiser.' 
              : 'Inspect descriptions of official certificates issued to Martina Morais da Silva. You can view the certificate information and add more certificates anytime.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Add Certificate Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{currentLang === 'pt' ? 'Adicionar Mais Certificados' : 'Add More Certificates'}</span>
          </button>

          {/* Upload / Replace PDF */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-300 bg-blue-950/70 border border-blue-700/80 hover:bg-blue-900 rounded-xl transition-colors cursor-pointer"
            title={currentCert?.customUploadedPdfUrl ? 'Substituir ficheiro deste certificado' : 'Carregar ficheiro original deste certificado'}
          >
            {isUploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            <span>
              {currentCert?.customUploadedPdfUrl 
                ? (currentLang === 'pt' ? 'Alterar / Substituir Documento' : 'Replace File') 
                : (currentLang === 'pt' ? 'Carregar Meu Documento (PDF)' : 'Upload Real Document')}
            </span>
          </button>


        </div>
      </div>

      {/* Certificate Selector Pill Tabs */}
      <div className="no-print flex items-center gap-2 overflow-x-auto pb-2">
        {certificates.map((cert, index) => (
          <button
            key={cert.id}
            onClick={() => setSelectedId(cert.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              selectedId === cert.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>{index + 1}. {localizedTitle(cert).length > 35 ? localizedTitle(cert).substring(0, 35) + '...' : localizedTitle(cert)}</span>
            {cert.customUploadedPdfUrl ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                {currentLang === 'pt' ? 'Documento Real' : 'Real Doc'}
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                {currentLang === 'pt' ? 'Pendente' : 'Pending'}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification banner on current document */}
      <div className="no-print p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between text-xs gap-3">
        {currentCert?.customUploadedPdfUrl ? (
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              {currentLang === 'pt' 
                ? `A visualizar o seu documento oficial: "${currentCert.fileName || 'certificado.pdf'}" (100% autêntico como está).` 
                : `Viewing your authentic official file: "${currentCert.fileName || 'certificate.pdf'}"`}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-amber-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              {currentLang === 'pt' 
                ? `Quer ver exatamente o seu documento emitido? Carregue aqui o ficheiro PDF ou imagem para aparecer tal como está!` 
                : `Want to view the exact original document? Upload the PDF or image file to display it natively!`}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer text-xs font-medium flex items-center gap-1"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>
              {currentCert?.customUploadedPdfUrl 
                ? (currentLang === 'pt' ? 'Substituir Documento' : 'Replace Document') 
                : (currentLang === 'pt' ? 'Carregar Documento Oficial' : 'Upload Official Document')}
            </span>
          </button>
          
          {currentCert?.isCustom && (
            <button
              onClick={() => handleDeleteCertificate(currentCert.id)}
              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
              title="Remover certificado"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Document Presentation Container */}
      <div className="w-full flex justify-center">
        {currentCert?.customUploadedPdfUrl ? (
          /* EMBED REAL ORIGINAL PDF / IMAGE EXACTLY AS IT IS VIA AUTHENTIC CANVAS VIEWER */
          <div id="cert-section-target" className="w-full max-w-4xl">
            <AuthenticDocumentViewer
              dataUrl={currentCert.customUploadedPdfUrl}
              title={localizedTitle(currentCert)}
              fileName={currentCert.fileName}
              onReplace={() => fileInputRef.current?.click()}
              lang={currentLang}
            />
          </div>
        ) : (
          /* UPLOAD PROMPT & INFORMATIVE CARD (NEVER FAKE SIMULATED DIPLOMA) */
          <div 
            id="cert-section-target" 
            className="w-full max-w-4xl bg-slate-900 rounded-2xl border border-slate-800 p-8 sm:p-12 shadow-2xl space-y-8"
          >
            {/* Upload Callout Box */}
            <div className="p-6 sm:p-8 rounded-2xl border-2 border-dashed border-blue-500/40 bg-gradient-to-br from-blue-950/20 via-slate-900 to-slate-950 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
                <FileText className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-xl mx-auto">
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {currentLang === 'pt' ? `Carregar Ficheiro de "${localizedTitle(currentCert)}"` : `Upload File for "${localizedTitle(currentCert)}"`}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {currentLang === 'pt'
                    ? 'Carregue o ficheiro original (PDF ou Imagem) do seu certificado emitido pela entidade para que os recrutadores e visitantes vejam o seu documento exatamente como ele é. Pode substituí-lo ou alterá-lo quando quiser.'
                    : 'Upload your authentic certificate file (PDF or Image) issued by the institution so recruiters see your document exactly as it is.'}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap justify-center items-center gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-600/25 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>{currentLang === 'pt' ? 'Carregar Ficheiro Oficial (PDF ou Imagem)' : 'Upload Official File (PDF or Image)'}</span>
                </button>
              </div>
            </div>

            {/* Official Registration & Syllabus Details */}
            <div className="p-6 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
                <div>
                  <div className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">
                    {currentLang === 'pt' ? 'Dados Oficiais da Formação' : 'Official Course Details'}
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white mt-0.5">{localizedTitle(currentCert)}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50">
                    {currentCert?.durationOrLevel}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                    {currentCert?.completionDate}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400">{currentLang === 'pt' ? 'Entidade Emissora:' : 'Issuing Institution:'}</span>
                  <p className="font-semibold text-slate-200 mt-0.5">{currentCert?.institution}</p>
                </div>
                <div>
                  <span className="text-slate-400">{currentLang === 'pt' ? 'Registo / Validação:' : 'Registration / Validation:'}</span>
                  <p className="font-mono text-emerald-400 mt-0.5">{currentCert?.verificationCode || 'Registo Oficial Válido'}</p>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-300 leading-relaxed">
                <span className="text-slate-400 block mb-1">{currentLang === 'pt' ? 'Âmbito das Competências:' : 'Competencies Scope:'}</span>
                <p>{currentCert?.description}</p>
              </div>
            </div>

          </div>
        )}
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
