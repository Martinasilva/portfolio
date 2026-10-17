import React from 'react';
import { Mail, Phone, MapPin, Printer } from 'lucide-react';
import { CANDIDATE_PROFILE } from '../data/candidateData';
import { Language, TRANSLATIONS } from '../data/i18n';

interface FooterProps {
  currentLang: Language;
  onSelectTab: (tab: string) => void;
  onOpenContact: () => void;
  onPrint: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentLang,
  onSelectTab,
  onOpenContact,
  onPrint
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <footer className="no-print mt-20 border-t border-slate-800/80 bg-slate-950 py-12 text-slate-400 text-xs">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
          
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-white tracking-tight">
              {CANDIDATE_PROFILE.name}
            </h3>
            <p className="text-xs text-blue-400 font-medium">
              {CANDIDATE_PROFILE.headline}
            </p>
            <p className="text-xs text-slate-500">
              Esch-sur-Alzette, Luxembourg · {t.hero.availabilityBadge}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <button
              onClick={() => onSelectTab('overview')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {t.nav.overview}
            </button>
            <button
              onClick={() => onSelectTab('cv')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {t.nav.cv}
            </button>
            <button
              onClick={() => onSelectTab('letter')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {t.nav.letter}
            </button>
            <button
              onClick={() => onSelectTab('skills')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {t.nav.skills}
            </button>
            <button
              onClick={() => onSelectTab('fit')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {t.nav.fit}
            </button>
            <button
              onClick={onPrint}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {t.nav.printPdf}
            </button>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} {CANDIDATE_PROFILE.name}. {t.footer.tagline}. {t.footer.copyright}
          </div>
          <div className="flex items-center gap-3">
            <a href={`mailto:${CANDIDATE_PROFILE.email}`} className="hover:text-slate-300 transition-colors">
              {CANDIDATE_PROFILE.email}
            </a>
            <span>·</span>
            <a href={`tel:${CANDIDATE_PROFILE.phone.replace(/\s+/g, '')}`} className="font-mono hover:text-slate-300 transition-colors">
              {CANDIDATE_PROFILE.phone}
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
