import React, { useState } from 'react';
import { 
  X, Mail, Phone, MapPin, Copy, Check, Send, 
  CheckCircle2 
} from 'lucide-react';
import { CANDIDATE_PROFILE } from '../data/candidateData';
import { Language, TRANSLATIONS } from '../data/i18n';

interface ContactModalProps {
  currentLang: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ currentLang, isOpen, onClose }) => {
  const t = TRANSLATIONS[currentLang];
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [recruiterName, setRecruiterName] = useState('');
  const [company, setCompany] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const mailtoUrl = `mailto:${CANDIDATE_PROFILE.email}?subject=${encodeURIComponent(
    `Interview Invitation: ${roleTitle || 'Junior / Trainee Opportunity'} at ${company || 'Our Company'}`
  )}&body=${encodeURIComponent(
    `Dear Martina,\n\nI reviewed your portfolio and credentials for the role of ${roleTitle || 'Junior / Trainee specialist'} at ${company || 'our company'}.\n\n${message || 'We would like to schedule an introductory interview to discuss your experience.'}\n\nBest regards,\n${recruiterName || 'Hiring Team'}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="space-y-1">
          <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            {t.contact.channelTag}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {t.contact.title}
          </h2>
          <p className="text-xs text-slate-400">
            {t.contact.subtitle}
          </p>
        </div>

        {/* Instant Contact Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          
          {/* Email Box */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>{t.contact.emailLabel}</span>
              </span>
              <button
                onClick={() => handleCopy(CANDIDATE_PROFILE.email, 'email')}
                className="text-slate-400 hover:text-white cursor-pointer"
                title="Copy email"
              >
                {copiedType === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <a 
              href={`mailto:${CANDIDATE_PROFILE.email}`}
              className="text-white font-medium hover:text-blue-400 transition-colors block truncate"
            >
              {CANDIDATE_PROFILE.email}
            </a>
          </div>

          {/* Phone Box */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.contact.phoneLabel}</span>
              </span>
              <button
                onClick={() => handleCopy(CANDIDATE_PROFILE.phone, 'phone')}
                className="text-slate-400 hover:text-white cursor-pointer"
                title="Copy phone"
              >
                {copiedType === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <a 
              href={`tel:${CANDIDATE_PROFILE.phone.replace(/\s+/g, '')}`}
              className="text-white font-mono font-medium hover:text-emerald-400 transition-colors block"
            >
              {CANDIDATE_PROFILE.phone}
            </a>
          </div>

        </div>

        {/* Location & Eligibility Note */}
        <div className="mt-4 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <div>
            {t.contact.locationNote}
          </div>
        </div>

        {/* Recruiter Dispatch Form */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {t.contact.formTitle}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">{t.contact.nameLabel}</label>
                <input
                  type="text"
                  required
                  placeholder={t.contact.namePlaceholder}
                  value={recruiterName}
                  onChange={(e) => setRecruiterName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">{t.contact.companyLabel}</label>
                <input
                  type="text"
                  required
                  placeholder={t.contact.companyPlaceholder}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">{t.contact.roleLabel}</label>
              <input
                type="text"
                placeholder={t.contact.rolePlaceholder}
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">{t.contact.noteLabel}</label>
              <textarea
                rows={3}
                placeholder={t.contact.notePlaceholder}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <a
                href={mailtoUrl}
                className="w-full sm:w-auto text-center px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors cursor-pointer"
              >
                {t.contact.openEmailClient}
              </a>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium transition-colors cursor-pointer"
              >
                {t.contact.recordRequest}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-6 p-6 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="font-bold text-white text-base">
              {t.contact.successTitle}
            </h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              {t.contact.successDesc}
            </p>
            <div className="pt-2">
              <a
                href={mailtoUrl}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{t.contact.sendViaEmailBtn}</span>
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
