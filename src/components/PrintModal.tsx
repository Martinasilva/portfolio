import React, { useState, useEffect } from 'react';
import { 
  Printer, X, FileText, Briefcase, Award, 
  Copy, Check, Download, ExternalLink, HelpCircle, Eye
} from 'lucide-react';
import { CANDIDATE_PROFILE, EDUCATION_LIST, EXPERIENCES, SKILL_CATEGORIES, LANGUAGES, CERTIFICATIONS, DIGITAL_COMPETENCE } from '../data/candidateData';
import { Language, TRANSLATIONS } from '../data/i18n';
import { printElementDirectly, downloadPlainText } from '../utils/printHelper';
import { getUploadedCV, getUploadedLetter, getVaultCertificates, downloadFileFromUrl, StoredDocument } from '../data/documentVault';
import { CertificateItem } from '../data/certificateStore';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  initialDoc?: 'cv' | 'letter' | 'certificates';
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  initialDoc = 'cv'
}) => {
  const [selectedDoc, setSelectedDoc] = useState<'cv' | 'letter' | 'certificates'>(initialDoc);
  const [copied, setCopied] = useState(false);
  const [uploadedCv, setUploadedCv] = useState<StoredDocument | null>(null);
  const [uploadedLetter, setUploadedLetter] = useState<StoredDocument | null>(null);
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const t = TRANSLATIONS[currentLang];

  useEffect(() => {
    if (isOpen) {
      if (initialDoc) setSelectedDoc(initialDoc);
      getUploadedCV().then(setUploadedCv);
      getUploadedLetter().then(setUploadedLetter);
      getVaultCertificates().then(setCertificates);
    }
  }, [isOpen, initialDoc]);

  if (!isOpen) return null;

  const dateStr = currentLang === 'pt' 
    ? 'Luxemburgo, Outubro de 2026' 
    : currentLang === 'fr' 
      ? 'Luxembourg, Octobre 2026' 
      : 'Luxembourg, October 2026';

  const recipientBlock = currentLang === 'pt'
    ? 'À atenção do Departamento de Recrutamento / Recursos Humanos\nLuxemburgo'
    : currentLang === 'fr'
      ? "À l'attention du Service Recrutement / Ressources Humaines\nLuxembourg"
      : 'To: The Hiring Team / Recruitment Department\nLuxembourg';

  const subjectLine = currentLang === 'pt'
    ? 'Assunto: Candidatura a Oportunidades Júnior / Trainee em TI, Cibersegurança, IA & Dados'
    : currentLang === 'fr'
      ? 'Objet : Candidature pour des opportunités Junior / Trainee en Informatique, Cybersécurité, IA & Données'
      : 'Subject: Application for Junior / Trainee Opportunities in IT, Cybersecurity, AI & Data';

  const handleDirectPrint = () => {
    const targetId = selectedDoc === 'cv' 
      ? 'print-modal-cv-content' 
      : selectedDoc === 'letter' 
        ? 'print-modal-letter-content' 
        : 'print-modal-certs-content';
    
    const title = selectedDoc === 'cv'
      ? `CV - ${CANDIDATE_PROFILE.name}`
      : selectedDoc === 'letter'
        ? `Carta de Motivacao - ${CANDIDATE_PROFILE.name}`
        : `Certificados - ${CANDIDATE_PROFILE.name}`;

    printElementDirectly(targetId, title);
  };

  const getDocPlainText = () => {
    if (selectedDoc === 'letter') {
      return `${CANDIDATE_PROFILE.name}\n${CANDIDATE_PROFILE.location}\n${CANDIDATE_PROFILE.phone} | ${CANDIDATE_PROFILE.email}\n\n${dateStr}\n\n${recipientBlock}\n\n${subjectLine}\n\n${t.letter.recipient}\n\n${t.letter.body.join('\n\n')}\n\n${t.letter.closing}\n${CANDIDATE_PROFILE.name}`;
    }
    
    // CV plain text
    return `${CANDIDATE_PROFILE.name}\n${CANDIDATE_PROFILE.headline}\n${CANDIDATE_PROFILE.location} | ${CANDIDATE_PROFILE.phone} | ${CANDIDATE_PROFILE.email}\n${CANDIDATE_PROFILE.graduationExpected}\n\nEXPERIÊNCIA PROFISSIONAL:\n` +
      EXPERIENCES.map(e => `${e.role} - ${e.company} (${e.location}) [${e.period}]\n${e.highlights.map(h => `- ${h}`).join('\n')}`).join('\n\n') +
      `\n\nHABILITAÇÕES ACADÉMICAS:\n` +
      EDUCATION_LIST.map(ed => `${ed.degree} - ${ed.institution}\nStatus: ${ed.status}\n${ed.coursework ? 'Cadeiras Relevantes: ' + ed.coursework.join(', ') : ''}`).join('\n\n') +
      `\n\nFORMAÇÃO COMPLEMENTAR & CERTIFICADOS:\n- ${CERTIFICATIONS[0].title} (${CERTIFICATIONS[0].institution}, ${CERTIFICATIONS[0].duration})\n- ${DIGITAL_COMPETENCE.framework} - ${DIGITAL_COMPETENCE.level}\n` +
      `\nLÍNGUAS:\n` + LANGUAGES.map(l => `- ${l.name}: ${l.levelCode}`).join('\n');
  };

  const handleCopyText = () => {
    const text = getDocPlainText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const text = getDocPlainText();
    const fname = selectedDoc === 'cv' ? 'CV_Martina_Morais_da_Silva.txt' : 'Carta_Motivacao_Martina_Morais_da_Silva.txt';
    downloadPlainText(fname, text);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden">
        
        {/* Header Bar */}
        <div className="no-print flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{currentLang === 'pt' ? 'Centro de Impressão & Exportação PDF Oficial' : currentLang === 'fr' ? 'Centre d\'Impression & Export PDF Officiel' : 'Official Print & PDF Export Center'}</span>
              </h3>
              <p className="text-xs text-slate-400">
                {currentLang === 'pt' ? 'Gera documentos A4 limpos em fundo branco, sem elementos do website' : 'Generates clean A4 documents on pure white background'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document Selector & Actions */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-slate-800 bg-slate-900/80">
          {/* Doc Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedDoc('cv')}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedDoc === 'cv' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>1. {currentLang === 'pt' ? 'Curriculum Vitae (A4)' : 'Curriculum Vitae (A4)'}</span>
            </button>
            <button
              onClick={() => setSelectedDoc('letter')}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedDoc === 'letter' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>2. {currentLang === 'pt' ? 'Carta de Motivação (A4)' : 'Motivation Letter (A4)'}</span>
            </button>
            <button
              onClick={() => setSelectedDoc('certificates')}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedDoc === 'certificates' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>3. {currentLang === 'pt' ? 'Certificados' : 'Certificates'}</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {selectedDoc === 'cv' && uploadedCv && (
              <button
                onClick={() => downloadFileFromUrl(uploadedCv.dataUrl, uploadedCv.name)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer shadow-sm"
                title={`Descarregar ${uploadedCv.name}`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>{currentLang === 'pt' ? 'Descarregar Meu CV' : 'Download CV File'}</span>
              </button>
            )}

            {selectedDoc === 'letter' && uploadedLetter && (
              <button
                onClick={() => downloadFileFromUrl(uploadedLetter.dataUrl, uploadedLetter.name)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer shadow-sm"
                title={`Descarregar ${uploadedLetter.name}`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>{currentLang === 'pt' ? 'Descarregar Minha Carta' : 'Download Letter File'}</span>
              </button>
            )}

            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : (currentLang === 'pt' ? 'Copiar Texto' : 'Copy Text')}</span>
            </button>

            <button
              onClick={handleDownloadTxt}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{currentLang === 'pt' ? 'Descarregar .txt' : 'Download .txt'}</span>
            </button>

            <button
              onClick={handleDirectPrint}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all cursor-pointer shadow-md shadow-blue-600/30"
            >
              <Printer className="w-4 h-4" />
              <span>{currentLang === 'pt' ? 'Imprimir / Guardar em PDF' : currentLang === 'fr' ? 'Imprimer / Sauvegarder en PDF' : 'Print / Save as PDF'}</span>
            </button>
          </div>
        </div>

        {/* Printable Preview Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950 flex justify-center">
          
          {selectedDoc === 'cv' && (
            <div className="w-full max-w-4xl space-y-4">
              {uploadedCv && (
                <div className="no-print p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{currentLang === 'pt' ? 'Ficheiro de CV Oficial carregado:' : 'Uploaded CV File:'} <strong>{uploadedCv.name}</strong></span>
                  </div>
                  <button
                    onClick={() => downloadFileFromUrl(uploadedCv.dataUrl, uploadedCv.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{currentLang === 'pt' ? 'Descarregar Ficheiro Original' : 'Download File'}</span>
                  </button>
                </div>
              )}
              <div id="print-modal-cv-content" className="a4-document-sheet bg-white text-slate-900 rounded-xl p-8 sm:p-12 border border-slate-200 shadow-xl max-w-4xl w-full font-sans text-xs leading-relaxed">
              {/* CV Header */}
              <div className="border-b-2 border-slate-900 pb-4">
                <div className="flex justify-between items-baseline">
                  <div>
                    <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight font-sans">
                      {CANDIDATE_PROFILE.name}
                    </h1>
                    <p className="text-xs font-bold text-blue-900 uppercase tracking-wider mt-0.5">
                      Junior IT • Security • AI & Data
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-slate-700 space-y-0.5 font-mono">
                    <p>{CANDIDATE_PROFILE.location}</p>
                    <p>{CANDIDATE_PROFILE.phone} • <span className="font-semibold text-slate-950">{CANDIDATE_PROFILE.email}</span></p>
                    <p className="font-sans font-semibold text-blue-900">{CANDIDATE_PROFILE.graduationExpected}</p>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="pt-4">
                <h2 className="text-xs font-black uppercase text-slate-950 tracking-wider border-b border-slate-300 pb-1 mb-2">
                  {currentLang === 'pt' ? 'Resumo Profissional' : 'Executive Summary'}
                </h2>
                <p className="text-slate-800 text-justify">
                  {CANDIDATE_PROFILE.subheadline}
                </p>
              </div>

              {/* Experience */}
              <div className="pt-4">
                <h2 className="text-xs font-black uppercase text-slate-950 tracking-wider border-b border-slate-300 pb-1 mb-2">
                  {currentLang === 'pt' ? 'Experiência Profissional' : 'Professional Experience'}
                </h2>
                <div className="space-y-3">
                  {EXPERIENCES.map((exp) => (
                    <div key={exp.id} className="experience-item">
                      <div className="flex justify-between items-baseline font-bold text-slate-950">
                        <span>{exp.role} — <span className="text-blue-950">{exp.company}</span></span>
                        <span className="text-[11px] font-mono text-slate-600">{exp.period} ({exp.duration}) · {exp.location}</span>
                      </div>
                      <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-700">
                        {exp.highlights.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="pt-4">
                <h2 className="text-xs font-black uppercase text-slate-950 tracking-wider border-b border-slate-300 pb-1 mb-2">
                  {currentLang === 'pt' ? 'Habilitações Académicas' : 'Education'}
                </h2>
                <div className="space-y-2">
                  {EDUCATION_LIST.map((edu, idx) => (
                    <div key={idx} className="education-item">
                      <div className="flex justify-between items-baseline font-bold text-slate-950">
                        <span>{edu.degree} — <span className="text-blue-950">{edu.institution}</span></span>
                        <span className="text-[11px] font-mono text-slate-600">{edu.status}</span>
                      </div>
                      {edu.coursework && (
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          <strong>{currentLang === 'pt' ? 'Unidades Curriculares:' : 'Relevant Coursework:'}</strong> {edu.coursework.join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications & Languages */}
              <div className="pt-4 grid grid-cols-2 gap-4">
                <div>
                  <h2 className="text-xs font-black uppercase text-slate-950 tracking-wider border-b border-slate-300 pb-1 mb-2">
                    {currentLang === 'pt' ? 'Formação & Certificações' : 'Certifications'}
                  </h2>
                  <p className="font-bold text-slate-950">{CERTIFICATIONS[0].title}</p>
                  <p className="text-[11px] text-slate-600">{CERTIFICATIONS[0].institution} • {CERTIFICATIONS[0].duration} (Julho 2026)</p>
                  <p className="font-bold text-slate-950 mt-1.5">{DIGITAL_COMPETENCE.framework}</p>
                  <p className="text-[11px] text-slate-600">{DIGITAL_COMPETENCE.level} — 5 Domínios</p>
                </div>
                <div>
                  <h2 className="text-xs font-black uppercase text-slate-950 tracking-wider border-b border-slate-300 pb-1 mb-2">
                    {currentLang === 'pt' ? 'Línguas' : 'Languages'}
                  </h2>
                  <div className="space-y-0.5 text-slate-800">
                    {LANGUAGES.map(l => (
                      <p key={l.name}><strong>{l.name}:</strong> {l.levelCode}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            </div>
          )}

          {selectedDoc === 'letter' && (
            <div className="w-full max-w-4xl space-y-4">
              {uploadedLetter && (
                <div className="no-print p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{currentLang === 'pt' ? 'Ficheiro de Carta de Motivação carregado:' : 'Uploaded Letter File:'} <strong>{uploadedLetter.name}</strong></span>
                  </div>
                  <button
                    onClick={() => downloadFileFromUrl(uploadedLetter.dataUrl, uploadedLetter.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{currentLang === 'pt' ? 'Descarregar Ficheiro Original' : 'Download File'}</span>
                  </button>
                </div>
              )}
              <div id="print-modal-letter-content" className="a4-document-sheet bg-white text-slate-900 rounded-xl p-8 sm:p-14 border border-slate-200 shadow-xl max-w-4xl w-full font-sans text-xs sm:text-sm leading-relaxed space-y-5">
              {/* Formal Letterhead */}
              <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-black text-slate-950 uppercase tracking-tight">
                    {CANDIDATE_PROFILE.name}
                  </h1>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Junior IT • Security • AI & Data
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {CANDIDATE_PROFILE.location}
                  </p>
                </div>
                <div className="text-right text-xs text-slate-700 font-mono space-y-0.5">
                  <p>{CANDIDATE_PROFILE.phone}</p>
                  <p className="font-semibold text-slate-950">{CANDIDATE_PROFILE.email}</p>
                  <p className="text-slate-500 font-sans text-[11px] pt-1">{dateStr}</p>
                </div>
              </div>

              {/* Recipient Block & Subject */}
              <div className="space-y-3 pt-2">
                <div className="text-slate-800 whitespace-pre-line font-medium text-xs sm:text-sm">
                  {recipientBlock}
                </div>
                <div className="p-2.5 bg-slate-50 border-l-4 border-slate-900 font-bold text-slate-950 text-xs sm:text-sm">
                  {subjectLine}
                </div>
              </div>

              {/* Salutation */}
              <div className="font-bold text-slate-950 pt-1">
                {t.letter.recipient}
              </div>

              {/* Body */}
              <div className="space-y-3 text-slate-800 text-justify text-xs sm:text-[13px] leading-relaxed">
                {t.letter.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {/* Closing */}
              <div className="pt-6 border-t border-slate-200 space-y-3">
                <p className="text-slate-800">{t.letter.closing}</p>
                <div className="pt-3">
                  <p className="font-bold text-slate-950">{CANDIDATE_PROFILE.name}</p>
                  <p className="text-xs text-slate-500">Candidata a Oportunidades Júnior & Trainee</p>
                </div>
              </div>
            </div>
            </div>
          )}

          {selectedDoc === 'certificates' && (
            <div id="print-modal-certs-content" className="max-w-4xl w-full space-y-5">
              <div className="bg-white text-slate-900 rounded-xl p-7 border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-950">{currentLang === 'pt' ? 'Formação e Certificações' : currentLang === 'fr' ? 'Formation et certifications' : 'Training & Certifications'}</h2>
                <p className="mt-2 text-sm text-slate-600">{currentLang === 'pt' ? 'Resumo das formações e competências comprovadas pelos certificados apresentados.' : currentLang === 'fr' ? 'Résumé des formations et compétences attestées par les certificats présentés.' : 'A summary of the training and skills represented by the certificates listed below.'}</p>
              </div>
              {certificates.map((cert) => (
                <article key={cert.id} className="bg-white text-slate-900 rounded-xl p-7 border border-slate-300 shadow-sm space-y-3 break-inside-avoid">
                  <div className="border-b border-slate-200 pb-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-blue-900">{cert.institution}</p>
                    <h3 className="mt-1 text-base font-bold text-slate-950">{currentLang === 'en' ? (cert.titleEn || cert.title) : currentLang === 'fr' ? (cert.titleFr || cert.titleEn || cert.title) : cert.title}</h3>
                    <p className="mt-1 text-xs text-slate-500">{cert.completionDate} · {cert.durationOrLevel}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700">{cert.description || (currentLang === 'pt' ? 'Formação complementar relevante para o desenvolvimento de competências técnicas e profissionais.' : currentLang === 'fr' ? 'Formation complémentaire pertinente pour le développement de compétences techniques et professionnelles.' : 'Additional training relevant to the development of technical and professional skills.')}</p>
                </article>
              ))}
            </div>
          )}

        </div>

        {/* Footer info notice */}
        <div className="no-print px-5 py-3 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span>
              {currentLang === 'pt' 
                ? 'Dica de Impressão: Na janela de impressão do seu navegador, escolha o destino "Guardar como PDF".'
                : 'Print Tip: In your browser print window, select "Save as PDF" as the destination.'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Dossiê de Martina Morais da Silva • Término: Janeiro 2027
          </span>
        </div>

      </div>
    </div>
  );
};
