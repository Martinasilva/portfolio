import React from 'react';
import { Mail, Printer, Globe, Award } from 'lucide-react';
import { CANDIDATE_PROFILE } from '../data/candidateData';
import { Language, TRANSLATIONS } from '../data/i18n';

interface HeaderProps {
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenContact: () => void;
  onPrint: () => void;
  onOpenCertificate?: (doc?: 'ai-cert' | 'digcomp') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onSelectLang,
  activeTab,
  setActiveTab,
  onOpenContact,
  onPrint,
  onOpenCertificate
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/60 bg-slate-950/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex min-h-[4.5rem] max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
        
        {/* Zone 1: Elegant Brand Mark with Monogram Icon and ample breathing room */}
        <a 
          href="#top" 
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('overview');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 group shrink-0"
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white font-extrabold text-sm shadow-md group-hover:scale-105 transition-transform">
            MS
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
              Martina Silva
            </span>
            <span className="text-[10px] text-slate-400 font-medium hidden sm:block -mt-0.5">
              IT • Security • AI & Data
            </span>
          </div>
        </a>

        {/* Zone 2: Clean, beautifully spaced navigation links with active state */}
        <nav className="hidden lg:flex items-center gap-3 xl:gap-4 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'overview' 
                ? 'text-white bg-slate-800/80 font-semibold shadow-sm' 
                : 'hover:text-white hover:bg-slate-900/60'
            }`}
          >
            {t.nav.overview}
          </button>
          <button
            onClick={() => setActiveTab('cv')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'cv' 
                ? 'text-white bg-slate-800/80 font-semibold shadow-sm' 
                : 'hover:text-white hover:bg-slate-900/60'
            }`}
          >
            {t.nav.cv}
          </button>
          <button
            onClick={() => setActiveTab('letter')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'letter' 
                ? 'text-white bg-slate-800/80 font-semibold shadow-sm' 
                : 'hover:text-white hover:bg-slate-900/60'
            }`}
          >
            {t.nav.letter}
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'skills' 
                ? 'text-white bg-slate-800/80 font-semibold shadow-sm' 
                : 'hover:text-white hover:bg-slate-900/60'
            }`}
          >
            {t.nav.skills}
          </button>
          <button
            onClick={() => setActiveTab('fit')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'fit' 
                ? 'text-white bg-slate-800/80 font-semibold shadow-sm' 
                : 'hover:text-white hover:bg-slate-900/60'
            }`}
          >
            {t.nav.fit}
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
              activeTab === 'certificates'
                ? 'text-white bg-slate-800/80 font-semibold shadow-sm'
                : 'text-amber-300 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>{t.nav.certificates}</span>
          </button>
        </nav>

        {/* Zone 3: Language Selector + Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto lg:ml-0">
          
          {/* Language Switcher Buttons (EN / FR / PT) */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => onSelectLang('en')}
              title="English (Default)"
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                currentLang === 'en' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onSelectLang('fr')}
              title="Français (Luxembourg)"
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                currentLang === 'fr' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              FR
            </button>
            <button
              onClick={() => onSelectLang('pt')}
              title="Português de Portugal"
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                currentLang === 'pt' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              PT
            </button>
          </div>

          <button
            onClick={onPrint}
            title={t.nav.printPdf}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900/80 border border-slate-700/70 rounded-xl hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.nav.printPdf}</span>
          </button>

          <button
            onClick={onOpenContact}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{t.nav.contactHire}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
