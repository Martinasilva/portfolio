import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, GraduationCap, Award, ShieldCheck, Languages, 
  MapPin, Phone, Mail, Printer, CheckCircle, ExternalLink,
  ChevronDown, ChevronUp, Download, Check, Eye, Layout, Sparkles,
  FileCheck, BadgeCheck, Upload, AlertCircle, RefreshCw
} from 'lucide-react';
import { 
  CANDIDATE_PROFILE, 
  EXPERIENCES, 
  EDUCATION_LIST, 
  CERTIFICATIONS, 
  DIGITAL_COMPETENCE, 
  LANGUAGES, 
  SKILL_CATEGORIES 
} from '../data/candidateData';
import { Language, TRANSLATIONS } from '../data/i18n';
import { printElementDirectly } from '../utils/printHelper';
import { 
  getUploadedCV, 
  saveUploadedCV, 
  downloadFileFromUrl, 
  formatBytes, 
  subscribeToVault, 
  StoredDocument 
} from '../data/documentVault';
import { AuthenticDocumentViewer } from './AuthenticDocumentViewer';

interface CurriculumVitaeProps {
  currentLang: Language;
  onPrint: () => void;
  onOpenCertificate?: (doc: 'ai-cert' | 'digcomp') => void;
}

export const CurriculumVitae: React.FC<CurriculumVitaeProps> = ({ 
  currentLang, 
  onPrint,
  onOpenCertificate 
}) => {
  const t = TRANSLATIONS[currentLang];
  const [filter, setFilter] = useState<'all' | 'luxembourg' | 'it-security'>('all');
  const [viewMode, setViewMode] = useState<'pdf' | 'a4' | 'web'>('a4');
  const [uploadedCV, setUploadedCV] = useState<StoredDocument | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load uploaded CV from Vault and listen to updates
  useEffect(() => {
    let isMounted = true;
    const loadCV = async () => {
      const doc = await getUploadedCV();
      if (isMounted) {
        setUploadedCV(doc);
        if (doc) {
          setViewMode('pdf');
        }
      }
    };
    loadCV();

    const unsubscribe = subscribeToVault(() => {
      loadCV();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const savedDoc = await saveUploadedCV(file);
      setUploadedCV(savedDoc);
      setViewMode('pdf');
    } catch (err) {
      console.error('Failed to save CV file:', err);
      window.alert(err instanceof Error ? err.message : 'Não foi possível guardar o CV no Cloudflare.');
    } finally {
      setIsUploading(false);
      // Reset input value so user can re-upload same filename if updated
      if (e.target) e.target.value = '';
    }
  };

  const handleDownloadCV = () => {
    if (uploadedCV) {
      downloadFileFromUrl(uploadedCV.dataUrl, uploadedCV.name);
    } else {
      // Fallback: trigger print modal to save A4 as PDF
      onPrint();
    }
  };

  const filteredExperiences = EXPERIENCES.filter(exp => {
    if (filter === 'luxembourg') return exp.isLuxembourg;
    if (filter === 'it-security') return exp.category === 'it-security' || exp.category === 'data-quality';
    return true;
  });

  return (
    <div className="space-y-8">
      
      {/* Hidden file input for CV upload / replacement */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,image/png,image/jpeg,image/webp"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* CV Status & Actions Bar */}
      <div className="no-print p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">
                {t.cv.title}
              </h2>
              {uploadedCV ? (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  {currentLang === 'pt' ? 'Ficheiro Oficial Carregado' : 'Official File Uploaded'}
                </span>
              ) : (
                <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {currentLang === 'pt' ? 'Modelo Executivo A4' : 'Executive A4 Model'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {uploadedCV 
                ? (currentLang === 'pt' 
                    ? `Ficheiro ativo: "${uploadedCV.name}" (${formatBytes(uploadedCV.size)}) — pode ser descarregado ou alterado quando desejar.` 
                    : `Active file: "${uploadedCV.name}" (${formatBytes(uploadedCV.size)}) — download or change anytime.`)
                : (currentLang === 'pt'
                    ? 'Pode carregar o seu ficheiro PDF de CV original para os recrutadores descarregarem e visualizarem tal como está.'
                    : 'Upload your original CV PDF for recruiters to download and inspect as it is.')}
            </p>
          </div>

          {/* Primary CV Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Direct Download Button */}
            <button
              onClick={handleDownloadCV}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
              title={uploadedCV ? `Descarregar ${uploadedCV.name}` : 'Descarregar CV'}
            >
              <Download className="w-4 h-4" />
              <span>{currentLang === 'pt' ? 'Descarregar Meu CV' : currentLang === 'fr' ? 'Télécharger mon CV' : 'Download CV File'}</span>
            </button>

            {/* Upload or Replace CV Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-300 bg-blue-950/70 border border-blue-700/80 hover:bg-blue-900 rounded-xl transition-colors cursor-pointer"
              title={uploadedCV ? 'Substituir ficheiro de CV por um novo' : 'Carregar o ficheiro PDF do seu CV'}
            >
              {isUploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>
                {uploadedCV 
                  ? (currentLang === 'pt' ? 'Alterar / Substituir CV' : 'Change / Replace CV') 
                  : (currentLang === 'pt' ? 'Carregar Meu CV (PDF)' : 'Upload CV File')}
              </span>
            </button>

            {/* Print / Export Center */}
            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.cv.printBtn}</span>
            </button>
          </div>
        </div>

        {/* Format Selection & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          {/* Format Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            {uploadedCV && (
              <button
                onClick={() => setViewMode('pdf')}
                className={`flex items-center gap-1.5 px-3 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  viewMode === 'pdf' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-400 hover:text-white'
                }`}
                title="Ver o ficheiro PDF original tal como está"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{currentLang === 'pt' ? 'Ver Documento Real (PDF)' : 'Real Document (PDF)'}</span>
              </button>
            )}

            <button
              onClick={() => setViewMode('a4')}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                viewMode === 'a4' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Formato folha A4 em texto limpo"
            >
              <Layout className="w-3.5 h-3.5" />
              <span>{currentLang === 'pt' ? 'Folha A4 Limpa' : currentLang === 'fr' ? 'Format A4' : 'A4 Sheet'}</span>
            </button>

            <button
              onClick={() => setViewMode('web')}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                viewMode === 'web' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Modo interativo web com filtros"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{currentLang === 'pt' ? 'Modo Web' : currentLang === 'fr' ? 'Mode Web' : 'Web View'}</span>
            </button>
          </div>

          {/* Filter Segmented Control (active in web/a4 view) */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.cv.filterAll}
            </button>
            <button
              onClick={() => setFilter('luxembourg')}
              className={`px-2.5 py-1 font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'luxembourg' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.cv.filterLux}
            </button>
            <button
              onClick={() => setFilter('it-security')}
              className={`px-2.5 py-1 font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'it-security' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.cv.filterSecurity}
            </button>
          </div>
        </div>
      </div>

      {/* CV Document Container */}
      <div id="printable-cv">
        {viewMode === 'pdf' && uploadedCV ? (
          /* AUTHENTIC ORIGINAL DOCUMENT EMBEDDED DIRECTLY AS IT IS VIA AUTHENTIC CANVAS VIEWER */
          <div className="w-full max-w-4xl mx-auto space-y-3">
            <AuthenticDocumentViewer
              dataUrl={uploadedCV.dataUrl}
              title={uploadedCV.name}
              fileName={uploadedCV.name}
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
          /* EXACT CLEAN WHITE A4 EXECUTIVE CV (IDENTICAL TO USER'S OFFICIAL DOSSIER) */
          <div className="a4-document-sheet bg-white text-slate-950 rounded-xl p-8 sm:p-12 border border-slate-200 shadow-2xl space-y-6 max-w-4xl mx-auto font-sans">
            
            {/* Header Block */}
            <div className="border-b-2 border-slate-900 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight font-sans">
                    {CANDIDATE_PROFILE.name}
                  </h1>
                  <p className="text-xs font-bold text-blue-800 tracking-wider mt-0.5 uppercase">
                    Junior IT • Security • AI & Data
                  </p>
                </div>
                <div className="text-xs text-slate-700 flex flex-wrap items-center justify-start sm:justify-end gap-x-2 gap-y-1 font-mono">
                  <span>{CANDIDATE_PROFILE.location}</span>
                  <span>·</span>
                  <span>{CANDIDATE_PROFILE.phone}</span>
                  <span>·</span>
                  <span className="font-semibold text-slate-900">{CANDIDATE_PROFILE.email}</span>
                </div>
              </div>
            </div>

            {/* Profile Summary */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1">
                {t.cv.profileHeading}
              </h2>
              <p className="text-xs sm:text-[13px] text-slate-800 leading-relaxed text-justify">
                {t.overview.summary}
              </p>
            </div>

            {/* Technical Skills */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1">
                {t.cv.skillsHeading}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-800">
                <div>
                  <strong className="text-slate-950">IT & Security Foundations:</strong>{' '}
                  <span>IT support & troubleshooting, systems access management, incident documentation, log review, information security awareness, phishing recognition, data protection, Windows, Linux fundamentals.</span>
                </div>
                <div>
                  <strong className="text-slate-950">AI, Data & Quality:</strong>{' '}
                  <span>Data analysis, data quality & validation, annotation & quality control, workflow optimisation, AI fundamentals & evaluation, advanced Microsoft Excel, SQL / MySQL.</span>
                </div>
                <div>
                  <strong className="text-slate-950">Programming & Web:</strong>{' '}
                  <span>JavaScript, PHP, C / C++, Web development, WordPress, Object-oriented programming principles.</span>
                </div>
                <div>
                  <strong className="text-slate-950">Tools & Environments:</strong>{' '}
                  <span>Microsoft 365, Notion, Photoshop, Helpdesk ticket workflows.</span>
                </div>
              </div>
            </div>

            {/* Professional Experience */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-300 pb-1">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest">
                  {t.cv.experienceHeading}
                </h2>
                <span className="text-[11px] text-slate-500 font-mono">
                  {t.cv.showingCount} {filteredExperiences.length} / {EXPERIENCES.length}
                </span>
              </div>

              <div className="space-y-4">
                {filteredExperiences.map((exp) => (
                  <div key={exp.id} className="experience-item space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between text-xs">
                      <div>
                        <strong className="text-slate-950 font-bold">{exp.role}</strong>
                        <span className="text-slate-700"> — {exp.company}, {exp.location}</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-600">
                        {exp.period} | {exp.duration}
                      </div>
                    </div>

                    <ul className="list-disc list-outside pl-4 space-y-0.5 text-xs text-slate-800 leading-relaxed">
                      {exp.highlights.map((bullet, bIdx) => (
                        <li key={bIdx}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1">
                {t.cv.educationHeading}
              </h2>

              <div className="space-y-3">
                {EDUCATION_LIST.map((edu, idx) => (
                  <div key={idx} className="education-item space-y-1 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                      <div>
                        <strong className="text-slate-950">{edu.institution}</strong>
                        <span className="text-slate-700"> — {edu.degree}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-700 font-semibold">
                        {idx === 0 
                          ? (currentLang === 'fr' 
                              ? 'Étudiante finaliste • Diplôme prévu : Janvier 2027' 
                              : currentLang === 'pt' 
                                ? 'Finalista • Conclusão Prevista da Universidade: Janeiro de 2027' 
                                : 'Finalist • Expected University Graduation: January 2027')
                          : edu.status}
                      </span>
                    </div>

                    {edu.coursework && (
                      <div className="text-[11px] text-slate-700">
                        <strong className="text-slate-900">{t.cv.courseworkLabel} </strong>
                        {edu.coursework.join(' • ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Training & Certification with Interactive Viewer Button */}
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-300 pb-1">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest">
                  {t.cv.trainingHeading}
                </h2>
                {onOpenCertificate && (
                  <button
                    onClick={() => onOpenCertificate('ai-cert')}
                    className="no-print inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5 text-blue-600" />
                    <span>{currentLang === 'pt' ? 'Ver Certificado Oficial (ID: 6904414939MS)' : currentLang === 'fr' ? 'Voir le Certificat Officiel' : 'View Official Certificate'}</span>
                  </button>
                )}
              </div>

              <div className="text-xs space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <strong className="text-slate-950">{CERTIFICATIONS[0].title}</strong> — <span className="text-slate-700">{CERTIFICATIONS[0].institution}</span>
                  </div>
                  <span className="font-mono text-slate-600 text-[11px]">{CERTIFICATIONS[0].duration}, {CERTIFICATIONS[0].completionDate}</span>
                </div>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  {CERTIFICATIONS[0].details}
                </p>
              </div>
            </div>

            {/* Digital Competence with Interactive Viewer Button */}
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-300 pb-1">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest">
                  {t.cv.digCompHeading}
                </h2>
                {onOpenCertificate && (
                  <button
                    onClick={() => onOpenCertificate('digcomp')}
                    className="no-print inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{currentLang === 'pt' ? 'Ver Relatório DigComp (Nível 6 Avançado)' : currentLang === 'fr' ? 'Voir le Rapport DigComp' : 'View DigComp Report (Level 6)'}</span>
                  </button>
                )}
              </div>
              <div className="text-xs text-slate-800 leading-relaxed">
                <strong className="text-slate-950">{DIGITAL_COMPETENCE.framework}</strong> — <strong className="text-emerald-800">{DIGITAL_COMPETENCE.level}</strong>: {DIGITAL_COMPETENCE.domains.join('; ')}.
              </div>
            </div>

            {/* Languages & Additional Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-300 text-xs text-slate-800">
              <div>
                <h2 className="font-bold text-slate-900 uppercase tracking-wider mb-1">
                  {t.cv.languagesHeading}
                </h2>
                <p>
                  <strong>Portuguese:</strong> Native · <strong>English:</strong> Fluent (C1)
                </p>
                <p>
                  <strong>French:</strong> Intermediate (B1/B2) · <strong>Spanish:</strong> Basic (A2)
                </p>
              </div>

              <div>
                <h2 className="font-bold text-slate-900 uppercase tracking-wider mb-1">
                  {t.cv.additionalHeading}
                </h2>
                <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                  <li>Driving licence — Category B</li>
                  <li>Eligible to work in Luxembourg / EU Citizen</li>
                  <li>Open to Junior / Trainee positions in IT, SOC, Cybersecurity & AI</li>
                </ul>
              </div>
            </div>

          </div>
        ) : (
          /* INTERACTIVE WEB VIEW (DARK MODERN) */
          <div className="print-card rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-10 text-slate-200 shadow-xl space-y-8">
            
            {/* CV Header Block */}
            <div className="border-b border-slate-800 pb-6 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
                    {CANDIDATE_PROFILE.name}
                  </h1>
                  <p className="text-sm font-semibold text-blue-400 tracking-wider mt-1 uppercase">
                    {CANDIDATE_PROFILE.headline}
                  </p>
                </div>
                <div className="text-xs text-slate-400 flex flex-wrap items-center justify-center sm:justify-end gap-x-2 gap-y-1">
                  <span>{CANDIDATE_PROFILE.location}</span>
                  <span aria-hidden="true">·</span>
                  <a href={`tel:${CANDIDATE_PROFILE.phone.replace(/\s+/g, '')}`} className="hover:text-blue-400">
                    {CANDIDATE_PROFILE.phone}
                  </a>
                  <span aria-hidden="true">·</span>
                  <a href={`mailto:${CANDIDATE_PROFILE.email}`} className="hover:text-blue-400">
                    {CANDIDATE_PROFILE.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Profile Section */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-1">
                {t.cv.profileHeading}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-justify">
                {t.overview.summary}
              </p>
            </div>

            {/* Technical Skills Section */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-1">
                {t.cv.skillsHeading}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-white">IT & Security Foundations:</span>
                  <p className="text-slate-300 leading-relaxed">
                    IT support and troubleshooting • Systems and access management • Incident documentation • Log review • Information security awareness • Phishing and suspicious-email recognition • Data protection awareness • Windows • Linux fundamentals
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-white">AI, Data & Quality:</span>
                  <p className="text-slate-300 leading-relaxed">
                    Data analysis • Data quality and validation • Annotation and quality control • Workflow optimisation • AI fundamentals • Microsoft Excel (advanced) • SQL / MySQL
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-white">Programming & Data:</span>
                  <p className="text-slate-300 leading-relaxed">
                    JavaScript • PHP • C / C++ • Web development • WordPress • Object-oriented programming fundamentals
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-white">Tools:</span>
                  <p className="text-slate-300 leading-relaxed">
                    Microsoft Office • WordPress • Notion • Photoshop
                  </p>
                </div>
              </div>
            </div>

            {/* Professional Experience Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {t.cv.experienceHeading}
                </h2>
                <span className="text-[11px] text-slate-500 font-mono">
                  {t.cv.showingCount} {filteredExperiences.length} / {EXPERIENCES.length}
                </span>
              </div>

              <div className="space-y-6">
                {filteredExperiences.map((exp) => (
                  <div key={exp.id} className="relative pl-0 sm:pl-4 sm:border-l-2 sm:border-slate-800 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                      <div>
                        <h3 className="text-sm font-bold text-white">
                          {exp.role} <span className="font-normal text-slate-400">— {exp.company}, {exp.location}</span>
                        </h3>
                      </div>
                      <div className="text-xs font-mono text-slate-400 tabular-nums">
                        {exp.period} <span className="text-slate-600">|</span> {exp.duration}
                      </div>
                    </div>

                    <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-slate-300 leading-relaxed">
                      {exp.highlights.map((bullet, bIdx) => (
                        <li key={bIdx}>{bullet}</li>
                      ))}
                    </ul>

                    {exp.technologies && (
                      <div className="text-[11px] text-slate-400 pt-1 flex flex-wrap gap-x-2">
                        <span className="text-slate-500 font-medium">Domain:</span>
                        {exp.technologies.join(' · ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-1">
                {t.cv.educationHeading}
              </h2>

              <div className="space-y-5">
                {EDUCATION_LIST.map((edu, idx) => (
                  <div key={idx} className="space-y-1.5 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                      <h3 className="font-bold text-white text-sm">
                        {edu.institution} <span className="font-normal text-slate-400">— {edu.degree}</span>
                      </h3>
                      <span className="text-slate-400 font-mono text-xs">
                        {idx === 0 
                          ? (currentLang === 'fr' 
                              ? 'Étudiante finaliste • Diplôme prévu : Janvier 2027' 
                              : currentLang === 'pt' 
                                ? 'Finalista • Conclusão Prevista da Universidade: Janeiro de 2027' 
                                : 'Finalist • Expected University Graduation: January 2027')
                          : edu.status}
                      </span>
                    </div>

                    {edu.coursework && (
                      <div className="pt-1 text-slate-300">
                        <span className="font-semibold text-slate-200">{t.cv.courseworkLabel} </span>
                        <span className="text-slate-400">
                          {edu.coursework.join(' • ')}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Training & Certification */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {t.cv.trainingHeading}
                </h2>
                {onOpenCertificate && (
                  <button
                    onClick={() => onOpenCertificate('ai-cert')}
                    className="no-print inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-white bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5 text-blue-400" />
                    <span>{currentLang === 'pt' ? 'Ver Certificado Oficial (Universidade Aberta)' : 'View Official Certificate (Universidade Aberta)'}</span>
                  </button>
                )}
              </div>

              <div className="text-xs space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                  <div className="font-bold text-white">
                    {CERTIFICATIONS[0].title} — <span className="font-normal text-slate-400">{CERTIFICATIONS[0].institution}</span>
                  </div>
                  <span className="font-mono text-slate-400">{CERTIFICATIONS[0].duration}, {CERTIFICATIONS[0].completionDate}</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {CERTIFICATIONS[0].details}
                </p>
              </div>
            </div>

            {/* Digital Competence */}
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {t.cv.digCompHeading}
                </h2>
                {onOpenCertificate && (
                  <button
                    onClick={() => onOpenCertificate('digcomp')}
                    className="no-print inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{currentLang === 'pt' ? 'Ver Relatório DigComp (Nível 6 Avançado)' : 'View DigComp Report (Level 6 Advanced)'}</span>
                  </button>
                )}
              </div>
              <div className="text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-white">{DIGITAL_COMPETENCE.framework}</span> — <strong className="text-emerald-400 font-semibold">{DIGITAL_COMPETENCE.level}</strong>: {DIGITAL_COMPETENCE.domains.join('; ')}.
              </div>
            </div>

            {/* Languages & Additional Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-800">
              
              {/* Languages */}
              <div className="space-y-2">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {t.cv.languagesHeading}
                </h2>
                <div className="text-xs text-slate-300 space-y-1">
                  <p>
                    <strong className="text-white">Portuguese</strong> — Native <span className="text-slate-600">·</span> <strong className="text-white">English</strong> — Fluent
                  </p>
                  <p>
                    <strong className="text-white">French</strong> — Intermediate <span className="text-slate-600">·</span> <strong className="text-white">Spanish</strong> — Beginner
                  </p>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-2">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {t.cv.additionalHeading}
                </h2>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  <li>Driving licence — Category B</li>
                  <li>Professional interest in IT Security, Cybersecurity and Security Operations (SOC)</li>
                  <li>Open to Junior / Trainee positions in IT Security, SOC and Cybersecurity</li>
                </ul>
              </div>

            </div>

          </div>
        )}
      </div>

    </div>
  );
};
