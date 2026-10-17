import React, { useState, useEffect } from 'react';
import { 
  FileText, Printer, Copy, Check, Eye, Layout, Sparkles, CheckCircle2,
  Upload, Edit3, RotateCcw, AlertCircle, Download, RefreshCw
} from 'lucide-react';
import { CANDIDATE_PROFILE } from '../data/candidateData';
import { Language, TRANSLATIONS } from '../data/i18n';
import { printElementDirectly } from '../utils/printHelper';
import { 
  getUploadedLetter, 
  saveUploadedLetter, 
  downloadFileFromUrl, 
  formatBytes, 
  subscribeToVault, 
  StoredDocument 
} from '../data/documentVault';
import { AuthenticDocumentViewer } from './AuthenticDocumentViewer';

interface MotivationLetterProps {
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
  onPrint: () => void;
  onOpenContact: () => void;
}

export const MotivationLetter: React.FC<MotivationLetterProps> = ({
  currentLang,
  onSelectLang,
  onPrint,
  onOpenContact
}) => {
  const t = TRANSLATIONS[currentLang];
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'pdf' | 'a4' | 'web'>('a4');
  const [isEditing, setIsEditing] = useState(false);
  const [uploadedLetter, setUploadedLetter] = useState<StoredDocument | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Custom text per language
  const [customBodyText, setCustomBodyText] = useState<string>('');

  const letterStorageKey = `candidate_letter_text_${currentLang}`;

  useEffect(() => {
    let isMounted = true;
    const loadLetter = async () => {
      const doc = await getUploadedLetter();
      if (isMounted) {
        setUploadedLetter(doc);
        if (doc) {
          setViewMode('pdf');
        }
      }
    };
    loadLetter();

    const unsubscribe = subscribeToVault(() => {
      loadLetter();
    });

    try {
      const storedText = localStorage.getItem(letterStorageKey);
      if (storedText) {
        setCustomBodyText(storedText);
      } else {
        setCustomBodyText(t.letter.body.join('\n\n'));
      }
    } catch (err) {
      console.warn('Storage read error', err);
      setCustomBodyText(t.letter.body.join('\n\n'));
    }

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [currentLang]);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const subjectLine = {
    en: "Subject: Application for Junior / Trainee Opportunities in IT, Cybersecurity, AI & Data",
    fr: "Objet : Candidature pour des opportunités de niveau Junior / Trainee en Informatique, Cybersécurité, IA & Données",
    pt: "Assunto: Candidatura a Oportunidades Júnior / Trainee em TI, Cibersegurança, IA & Dados"
  }[currentLang];

  const dateStr = {
    en: "Luxembourg, October 2026",
    fr: "Luxembourg, Octobre 2026",
    pt: "Luxemburgo, Outubro de 2026"
  }[currentLang];

  const recipientBlock = {
    en: "To: The Hiring Team / Recruitment Department\nLuxembourg",
    fr: "À l'attention du Service Recrutement / Ressources Humaines\nLuxembourg",
    pt: "À atenção do Departamento de Recrutamento / Recursos Humanos\nLuxemburgo"
  }[currentLang];

  const paragraphs = customBodyText
    ? customBodyText.split('\n\n').filter(p => p.trim().length > 0)
    : t.letter.body;

  const handleCopy = () => {
    const fullText = `${CANDIDATE_PROFILE.name}\n${CANDIDATE_PROFILE.location}\n${CANDIDATE_PROFILE.phone} | ${CANDIDATE_PROFILE.email}\n\n${dateStr}\n\n${recipientBlock}\n\n${subjectLine}\n\n${t.letter.recipient}\n\n${paragraphs.join('\n\n')}\n\n${t.letter.closing}\n\n${CANDIDATE_PROFILE.name}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const savedDoc = await saveUploadedLetter(file);
      setUploadedLetter(savedDoc);
      setViewMode('pdf');
    } catch (err) {
      console.error('Failed to save letter:', err);
      window.alert(err instanceof Error ? err.message : 'Não foi possível guardar a carta de motivação no Cloudflare.');
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleDownloadLetter = () => {
    if (uploadedLetter) {
      downloadFileFromUrl(uploadedLetter.dataUrl, uploadedLetter.name);
    } else {
      onPrint();
    }
  };

  const handleSaveText = () => {
    setIsEditing(false);
    try {
      localStorage.setItem(letterStorageKey, customBodyText);
    } catch (err) {
      console.warn('Save error', err);
    }
  };

  const handleResetText = () => {
    const defaultText = t.letter.body.join('\n\n');
    setCustomBodyText(defaultText);
    try {
      localStorage.removeItem(letterStorageKey);
    } catch (err) {
      console.warn('Reset error', err);
    }
    setIsEditing(false);
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

      {/* Top Controls Bar (No Print) */}
      <div className="no-print p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                {t.letter.title}
              </h2>
              {uploadedLetter ? (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {currentLang === 'pt' ? 'Ficheiro Oficial Carregado' : 'Official File Uploaded'}
                </span>
              ) : (
                <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {currentLang === 'pt' ? 'Modelo Formal A4' : 'Formal A4 Model'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {uploadedLetter
                ? (currentLang === 'pt'
                    ? `Ficheiro ativo: "${uploadedLetter.name}" (${formatBytes(uploadedLetter.size)}) — pode ser descarregado ou alterado quando desejar.`
                    : `Active file: "${uploadedLetter.name}" (${formatBytes(uploadedLetter.size)}) — download or change anytime.`)
                : (currentLang === 'pt'
                    ? 'Pode carregar o seu ficheiro PDF da Carta de Motivação para os recrutadores descarregarem e visualizarem como ele é.'
                    : 'Upload your original motivation letter PDF for recruiters to download and inspect.')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Direct Download Button */}
            <button
              onClick={handleDownloadLetter}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
              title={uploadedLetter ? `Descarregar ${uploadedLetter.name}` : 'Descarregar Carta'}
            >
              <Download className="w-4 h-4" />
              <span>{currentLang === 'pt' ? 'Descarregar Carta' : currentLang === 'fr' ? 'Télécharger la Lettre' : 'Download Letter File'}</span>
            </button>

            {/* Upload / Replace Letter PDF */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-300 bg-blue-950/70 border border-blue-700/80 hover:bg-blue-900 rounded-xl transition-colors cursor-pointer"
              title={uploadedLetter ? 'Substituir ficheiro da carta por um novo' : 'Carregar ficheiro PDF original da carta'}
            >
              {isUploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>
                {uploadedLetter 
                  ? (currentLang === 'pt' ? 'Alterar / Substituir Carta' : 'Change / Replace Letter') 
                  : (currentLang === 'pt' ? 'Carregar Minha Carta (PDF)' : 'Upload Letter File')}
              </span>
            </button>

            {/* Print Button - opens dedicated print center */}
            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.letter.printBtn}</span>
            </button>
          </div>
        </div>

        {/* Format Selection & Options */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            {uploadedLetter && (
              <button
                onClick={() => setViewMode('pdf')}
                className={`flex items-center gap-1.5 px-3 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  viewMode === 'pdf' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-400 hover:text-white'
                }`}
                title="Ver o ficheiro PDF original tal como está"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{currentLang === 'pt' ? 'Ver Documento Real (PDF)' : 'Real Document (PDF)'}</span>
              </button>
            )}

            <button
              onClick={() => setViewMode('a4')}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                viewMode === 'a4' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Folha A4 Limpa"
            >
              <Layout className="w-3.5 h-3.5" />
              <span>{currentLang === 'pt' ? 'Folha A4 Limpa' : 'A4 Sheet'}</span>
            </button>

            <button
              onClick={() => setViewMode('web')}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                viewMode === 'web' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{currentLang === 'pt' ? 'Modo Escuro' : 'Dark Mode'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Edit / Customize Text Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                isEditing ? 'bg-amber-600 text-white' : 'text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700'
              }`}
              title="Editar ou colar o texto exato da sua carta de motivação"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-300" />
              <span>{isEditing ? (currentLang === 'pt' ? 'A Editar' : 'Editing') : (currentLang === 'pt' ? 'Editar / Colar Meu Texto' : 'Edit Text')}</span>
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t.letter.copiedBtn : t.letter.copyBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Inline Editor if active */}
      {isEditing && (
        <div className="no-print p-5 bg-slate-900 border border-amber-500/40 rounded-2xl space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
              <Edit3 className="w-4 h-4" />
              <span>{currentLang === 'pt' ? 'Cole ou edite aqui o texto exato da sua Carta de Motivação:' : 'Edit or paste your exact letter text:'}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetText}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{currentLang === 'pt' ? 'Restaurar Padrão' : 'Reset'}</span>
              </button>
              <button
                onClick={handleSaveText}
                className="px-3.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer"
              >
                {currentLang === 'pt' ? 'Guardar Texto' : 'Save Text'}
              </button>
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            {currentLang === 'pt' ? 'Separe os parágrafos com uma linha em branco (Enter duplo). O texto fica guardado localmente.' : 'Separate paragraphs with a blank line.'}
          </p>
          <textarea
            rows={10}
            value={customBodyText}
            onChange={(e) => setCustomBodyText(e.target.value)}
            className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-white font-sans text-xs sm:text-sm leading-relaxed focus:outline-none focus:border-blue-500"
          />
        </div>
      )}

      {/* Main Document Content */}
      <div id="printable-letter">
        {viewMode === 'pdf' && uploadedLetter ? (
          /* EMBED REAL ORIGINAL PDF VIA AUTHENTIC CANVAS VIEWER */
          <div className="w-full max-w-4xl mx-auto space-y-3">
            <AuthenticDocumentViewer
              dataUrl={uploadedLetter.dataUrl}
              title={uploadedLetter.name}
              fileName={uploadedLetter.name}
              onReplace={() => fileInputRef.current?.click()}
              lang={currentLang}
            />
            <div className="text-center pt-1">
              <button
                onClick={() => setViewMode('a4')}
                className="text-xs text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
              >
                {currentLang === 'pt' ? '← Ver Formato Texto A4' : '← View Clean A4 Text Version'}
              </button>
            </div>
          </div>
        ) : viewMode === 'a4' ? (
          /* EXACT 1:1 CLEAN WHITE A4 LETTER FORMAT (IDENTICAL TO USER'S DOCUMENT) */
          <div className="a4-document-sheet bg-white text-slate-900 rounded-xl p-8 sm:p-14 border border-slate-200 shadow-2xl space-y-6 max-w-4xl mx-auto font-sans">
            
            {/* Formal Header Letterhead */}
            <div className="border-b-2 border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight font-sans">
                  {CANDIDATE_PROFILE.name}
                </h1>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mt-0.5">
                  Junior IT • Security • AI & Data
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {CANDIDATE_PROFILE.location}
                </p>
              </div>

              <div className="text-xs text-slate-700 sm:text-right space-y-1 font-mono">
                <p>{CANDIDATE_PROFILE.phone}</p>
                <p className="text-slate-900 font-semibold">{CANDIDATE_PROFILE.email}</p>
                <p className="text-slate-500 font-sans text-[11px] pt-1">{dateStr}</p>
              </div>
            </div>

            {/* Recipient & Subject Line */}
            <div className="pt-2 space-y-3">
              <div className="text-xs sm:text-sm text-slate-800 whitespace-pre-line font-medium">
                {recipientBlock}
              </div>

              <div className="pt-2">
                <div className="text-xs sm:text-sm font-bold text-slate-950 bg-slate-50 p-2.5 rounded border-l-4 border-slate-800">
                  {subjectLine}
                </div>
              </div>
            </div>

            {/* Recipient Opening */}
            <div className="text-xs sm:text-sm font-bold text-slate-900 pt-1">
              {t.letter.recipient}
            </div>

            {/* Letter Body Paragraphs */}
            <div className="space-y-3.5 text-xs sm:text-[13px] text-slate-800 leading-relaxed text-justify">
              {paragraphs.map((paragraph, idx) => (
                <p key={idx}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Letter Signoff with Signature Space */}
            <div className="pt-6 border-t border-slate-200 space-y-3">
              <p className="text-xs sm:text-sm text-slate-800">
                {t.letter.closing}
              </p>
              
              <div className="pt-4 space-y-0.5">
                <p className="font-bold text-slate-950 font-sans text-xs sm:text-sm">
                  {CANDIDATE_PROFILE.name}
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  {CANDIDATE_PROFILE.graduationExpected}
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  {CANDIDATE_PROFILE.email} • {CANDIDATE_PROFILE.phone}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Web Dark Theme */
          <div className="p-6 sm:p-10 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6 max-w-4xl mx-auto">
            <div className="border-b border-slate-800 pb-4 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white">{CANDIDATE_PROFILE.name}</h3>
                <p className="text-xs text-blue-400">{CANDIDATE_PROFILE.headline}</p>
              </div>
              <div className="text-right text-xs text-slate-400 font-mono">
                <p>{CANDIDATE_PROFILE.location}</p>
                <p>{dateStr}</p>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-800/60 font-semibold text-xs sm:text-sm text-blue-200">
              {subjectLine}
            </div>
            <p className="font-semibold text-slate-200 text-xs sm:text-sm">{t.letter.recipient}</p>
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed text-justify">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
            <div className="pt-4 border-t border-slate-800 text-slate-300 text-xs sm:text-sm">
              <p>{t.letter.closing}</p>
              <p className="font-bold text-white mt-2">{CANDIDATE_PROFILE.name}</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
