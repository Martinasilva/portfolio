import React, { useState } from 'react';
import { X, Plus, Upload, FileText, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { CertificateItem } from '../data/certificateStore';
import { Language } from '../data/i18n';
import { formatBytes } from '../data/documentVault';

interface AddCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newCert: CertificateItem, file?: File) => void;
  currentLang: Language;
}

export const AddCertificateModal: React.FC<AddCertificateModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  currentLang
}) => {
  const [title, setTitle] = useState('');
  const [institution, setInstitution] = useState('');
  const [date, setDate] = useState('');
  const [durationOrLevel, setDurationOrLevel] = useState('');
  const [category, setCategory] = useState<'ai' | 'digcomp' | 'security' | 'it' | 'other'>('it');
  const [description, setDescription] = useState('');
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSizeText, setFileSizeText] = useState<string>('');
  const [isReadingFile, setIsReadingFile] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError(currentLang === 'pt' ? 'Formato não suportado. Escolha um PDF, JPG, PNG ou WebP.' : 'Unsupported format. Choose a PDF, JPG, PNG, or WebP file.');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError(currentLang === 'pt' ? 'O ficheiro excede 4 MB. Escolha um ficheiro mais pequeno.' : 'The file exceeds 4 MB. Please choose a smaller file.');
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
    setFileSizeText(formatBytes(file.size));
    setError(null);
    setIsReadingFile(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFileDataUrl(result);
      setIsReadingFile(false);
    };
    reader.onerror = () => {
      setError(currentLang === 'pt' ? 'Erro ao processar o ficheiro.' : 'Error reading file.');
      setIsReadingFile(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !institution.trim()) {
      setError(currentLang === 'pt' ? 'Por favor indique o título e a entidade emissora.' : 'Please enter title and institution.');
      return;
    }

    const newCert: CertificateItem = {
      id: `custom-cert-${Date.now()}`,
      title: title.trim(),
      institution: institution.trim(),
      completionDate: date.trim() || (currentLang === 'pt' ? 'Recente' : 'Recent'),
      durationOrLevel: durationOrLevel.trim() || (currentLang === 'pt' ? 'Certificação Oficial' : 'Official Certificate'),
      category,
      description: description.trim() || (currentLang === 'pt' ? 'Certificado oficial adicionado ao dossiê de competências.' : 'Official certificate added to dossier.'),
      customUploadedPdfUrl: fileDataUrl || undefined,
      fileName: fileName || undefined,
      isCustom: true
    };

    onAdd(newCert, selectedFile || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {currentLang === 'pt' ? 'Adicionar Novo Certificado' : 'Add New Certificate'}
              </h3>
              <p className="text-xs text-slate-400">
                {currentLang === 'pt' ? 'Pode anexar o seu ficheiro PDF ou imagem oficial' : 'You can attach your authentic PDF or image file'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/50 border border-red-800/80 text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-200 mb-1">
              {currentLang === 'pt' ? 'Nome do Certificado / Curso *' : 'Certificate Title *'}
            </label>
            <input
              type="text"
              required
              placeholder={currentLang === 'pt' ? 'ex.: Certificado de Cibersegurança / CCNA / Python' : 'e.g., Cybersecurity Fundamentals'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-200 mb-1">
                {currentLang === 'pt' ? 'Entidade Emissora *' : 'Issuing Institution *'}
              </label>
              <input
                type="text"
                required
                placeholder={currentLang === 'pt' ? 'ex.: Universidade Aberta / Cisco / Coursera' : 'e.g., Cisco, Coursera'}
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-200 mb-1">
                {currentLang === 'pt' ? 'Data / Ano' : 'Date / Year'}
              </label>
              <input
                type="text"
                placeholder={currentLang === 'pt' ? 'ex.: 2026 ou Outubro de 2026' : 'e.g., 2026'}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-200 mb-1">
                {currentLang === 'pt' ? 'Carga Horária / ECTS / Nível' : 'Hours / ECTS / Level'}
              </label>
              <input
                type="text"
                placeholder={currentLang === 'pt' ? 'ex.: 1 ECTS (26 Horas) ou Nível Avançado' : 'e.g., 20 Hours / 1 ECTS'}
                value={durationOrLevel}
                onChange={(e) => setDurationOrLevel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-200 mb-1">
                {currentLang === 'pt' ? 'Área / Categoria' : 'Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="ai">{currentLang === 'pt' ? 'IA & Aprendizagem' : 'AI & Data'}</option>
                <option value="digcomp">{currentLang === 'pt' ? 'Competências Digitais (DigComp)' : 'DigComp'}</option>
                <option value="security">{currentLang === 'pt' ? 'Cibersegurança & Redes' : 'Cybersecurity'}</option>
                <option value="it">{currentLang === 'pt' ? 'Suporte de TI & Sistemas' : 'IT & Systems'}</option>
                <option value="other">{currentLang === 'pt' ? 'Outro' : 'Other'}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1">
              {currentLang === 'pt' ? 'Descrição / Tópicos Aprendidos' : 'Description / Topics'}
            </label>
            <textarea
              rows={2}
              placeholder={currentLang === 'pt' ? 'Breve resumo das competências ou tópicos do certificado...' : 'Brief summary of topics covered...'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* File Upload Box */}
          <div className="border border-dashed border-slate-700 hover:border-blue-500 bg-slate-950/60 rounded-xl p-4 text-center transition-colors">
            <input
              type="file"
              id="cert-file-input"
              accept=".pdf,image/png,image/jpeg,image/webp"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="cert-file-input" className="cursor-pointer block">
              <Upload className="w-6 h-6 mx-auto text-blue-400 mb-1.5" />
              <p className="font-semibold text-white">
                {isReadingFile ? (
                  <span className="text-amber-400 flex items-center justify-center gap-1.5">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    {currentLang === 'pt' ? 'A processar documento de alta capacidade...' : 'Processing high-capacity file...'}
                  </span>
                ) : fileName ? (
                  <span className="text-emerald-400 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> {fileName} {fileSizeText ? `(${fileSizeText})` : ''}
                  </span>
                ) : (
                  currentLang === 'pt' ? 'Clique para anexar ficheiro PDF ou Imagem' : 'Click to attach PDF or Image file'
                )}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {currentLang === 'pt' ? 'Formatos suportados: PDF, PNG, JPG, WebP (até 4 MB)' : 'Supported: PDF, PNG, JPG, WebP (up to 4MB)'}
              </p>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors font-medium cursor-pointer"
            >
              {currentLang === 'pt' ? 'Cancelar' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isReadingFile}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors font-semibold shadow-md shadow-blue-600/30 cursor-pointer flex items-center gap-2"
            >
              {isReadingFile && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>{currentLang === 'pt' ? 'Gravar Certificado' : 'Save Certificate'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
