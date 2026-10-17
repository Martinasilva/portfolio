import React from 'react';
import { 
  ShieldCheck, CheckCircle2, ArrowRight, UserCheck, 
  GraduationCap, Briefcase 
} from 'lucide-react';
import { RECRUITER_ROLES, CANDIDATE_PROFILE } from '../data/candidateData';
import { Language, TRANSLATIONS } from '../data/i18n';

interface RoleFitAnalyzerProps {
  currentLang: Language;
  selectedRoleId: string;
  onSelectRole: (id: string) => void;
  onOpenContact: () => void;
}

export const RoleFitAnalyzer: React.FC<RoleFitAnalyzerProps> = ({
  currentLang,
  selectedRoleId,
  onSelectRole,
  onOpenContact
}) => {
  const t = TRANSLATIONS[currentLang];
  const currentRole = RECRUITER_ROLES.find(r => r.id === selectedRoleId) || RECRUITER_ROLES[0];

  return (
    <div className="space-y-8">
      
      {/* Intro Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 md:p-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
          <UserCheck className="w-4 h-4" />
          <span>{t.fit.badge}</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          {t.fit.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          {t.fit.subtitle}
        </p>
      </div>

      {/* Role Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {RECRUITER_ROLES.map((role) => {
          const isSelected = role.id === currentRole.id;
          return (
            <button
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                isSelected
                  ? 'border-blue-500 bg-blue-950/40 shadow-lg'
                  : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className={`font-mono font-bold tabular-nums ${isSelected ? 'text-blue-300' : 'text-slate-400'}`}>
                  {role.matchScore}
                </span>
                {isSelected && (
                  <span className="h-2 w-2 rounded-full bg-blue-400" />
                )}
              </div>
              <h3 className={`font-bold text-sm leading-snug ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                {role.title}
              </h3>
            </button>
          );
        })}
      </div>

      {/* Detailed Alignment Analysis for Selected Role */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-8 shadow-xl">
        
        {/* Role Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
              {currentLang === 'fr' ? 'Analyse Détaillée' : currentLang === 'pt' ? 'Análise Detalhada' : 'Detailed Alignment'}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              {currentRole.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              {currentRole.shortDesc}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                {currentRole.matchScore}
              </div>
              <div className="text-[11px] text-slate-400">{t.fit.compatibility}</div>
            </div>
            <button
              onClick={onOpenContact}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
            >
              {t.fit.interviewBtn}
            </button>
          </div>
        </div>

        {/* Why Martina Excels In This Role */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5 text-blue-400" />
            <span>{t.fit.whyHireTitle}</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentRole.whyHire.map((point, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Coursework & Skills Match */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Matched Academic Modules */}
          <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span>{t.fit.academicTitle}</span>
            </div>
            <p className="text-xs text-slate-400">
              {t.fit.academicDesc}
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              {currentRole.keyCourses.map((course, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  <span>{course}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Matched Hands-On Skills */}
          <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t.fit.practicalTitle}</span>
            </div>
            <p className="text-xs text-slate-400">
              {t.fit.practicalDesc}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {currentRole.matchedSkills.map((skill, idx) => (
                <span 
                  key={idx}
                  className="px-2.5 py-1 text-xs font-medium text-slate-200 bg-slate-900 border border-slate-700/80 rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Next Step Recruiter Call to Action */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            {t.fit.localEligibility}
          </div>
          <button
            onClick={onOpenContact}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors cursor-pointer"
          >
            <span>{t.fit.proceedBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
