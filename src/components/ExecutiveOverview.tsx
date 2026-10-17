import React from 'react';
import { Shield, Database, ArrowUpRight, CheckCircle2, FileText, Cpu, Server, Briefcase, Award } from 'lucide-react';
import { CANDIDATE_PROFILE, EXPERIENCES, RECRUITER_ROLES } from '../data/candidateData';
import { Language, TRANSLATIONS } from '../data/i18n';

interface ExecutiveOverviewProps {
  currentLang: Language;
  onNavigateTab: (tab: string) => void;
  onSelectRole: (roleId: string) => void;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({
  currentLang,
  onNavigateTab,
  onSelectRole
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <div className="space-y-12">
      
      {/* 30-Second Briefing Box */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {t.overview.title}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {t.overview.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateTab('letter')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t.overview.motivationBtn}</span>
            </button>
            <button
              onClick={() => onNavigateTab('cv')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
            >
              <span>{t.overview.structuredCvBtn}</span>
            </button>
          </div>
        </div>

        {/* Narrative Paragraph */}
        <div className="pt-6 space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
          <p>
            {t.overview.summary}
          </p>
        </div>

        {/* Four Competitive Advantages */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
                <Shield className="w-4 h-4" />
                <span>{t.overview.pillar1Title}</span>
              </div>
              <p className="mt-2 text-xs text-slate-400 leading-normal">
                {t.overview.pillar1Desc}
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('certificates')}
              className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-white bg-blue-950/50 hover:bg-blue-900/60 border border-blue-800/50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer self-start"
            >
              <Shield className="w-3 h-3 text-blue-400" />
              <span>{currentLang === 'pt' ? 'Ver DigComp Nível 6' : 'View DigComp Report'}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <Database className="w-4 h-4" />
              <span>{t.overview.pillar2Title}</span>
            </div>
            <p className="mt-2 text-xs text-slate-400 leading-normal">
              {t.overview.pillar2Desc}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
                <Cpu className="w-4 h-4" />
                <span>{t.overview.pillar3Title}</span>
              </div>
              <p className="mt-2 text-xs text-slate-400 leading-normal">
                {t.overview.pillar3Desc}
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('certificates')}
              className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-purple-300 hover:text-white bg-purple-950/50 hover:bg-purple-900/60 border border-purple-800/50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer self-start"
            >
              <Award className="w-3 h-3 text-purple-400" />
              <span>{currentLang === 'pt' ? 'Ver Certificado IA (UAb)' : 'View AI Certificate'}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <Server className="w-4 h-4" />
              <span>{t.overview.pillar4Title}</span>
            </div>
            <p className="mt-2 text-xs text-slate-400 leading-normal">
              {t.overview.pillar4Desc}
            </p>
          </div>
        </div>
      </section>

      {/* Target Role Alignment Quick Match */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {t.overview.targetRolesTitle}
            </h3>
            <p className="text-xs text-slate-400">
              {t.overview.targetRolesSubtitle}
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('fit')}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>{t.overview.openFitAnalyzer}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RECRUITER_ROLES.map((role) => (
            <div
              key={role.id}
              onClick={() => {
                onSelectRole(role.id);
                onNavigateTab('fit');
              }}
              className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors text-base">
                    {role.title}
                  </h4>
                  <span className="font-mono text-xs font-semibold text-emerald-400 tabular-nums bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                    {role.matchScore}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                  {role.shortDesc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  {currentLang === 'fr' ? 'Voir compétences & cours' : currentLang === 'pt' ? 'Ver competências & curso' : 'View skills & coursework match'}
                </span>
                <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center">
                  &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Luxembourg Experience Spotlight */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-400" />
            <span>{t.overview.luxSpotlightTitle}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {t.overview.luxSpotlightSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EXPERIENCES.filter(exp => exp.isLuxembourg).map(exp => (
            <div key={exp.id} className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-white text-base">{exp.role}</h4>
                  <div className="text-xs text-blue-400 font-medium mt-0.5">{exp.company} — {exp.location}</div>
                </div>
                <span className="text-xs text-slate-400 font-mono tabular-nums">{exp.period} · {exp.duration}</span>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-300">
                {exp.highlights.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {exp.technologies && (
                <div className="pt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-400">
                  <span className="text-slate-500">{t.overview.keyFocus}</span>
                  {exp.technologies.map((tItem, idx) => (
                    <React.Fragment key={idx}>
                      <span className="text-slate-300">{tItem}</span>
                      {idx < exp.technologies!.length - 1 && <span className="text-slate-600">·</span>}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
