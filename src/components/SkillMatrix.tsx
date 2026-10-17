import React, { useState } from 'react';
import { 
  Shield, Database, Code, Terminal, CheckCircle2, 
  Search, BookOpen, Award, ShieldCheck 
} from 'lucide-react';
import { SKILL_CATEGORIES, EDUCATION_LIST, DIGITAL_COMPETENCE, CERTIFICATIONS } from '../data/candidateData';
import { Language, TRANSLATIONS } from '../data/i18n';

interface SkillMatrixProps {
  currentLang: Language;
  onOpenCertificate?: (doc: 'ai-cert' | 'digcomp') => void;
}

export const SkillMatrix: React.FC<SkillMatrixProps> = ({ currentLang, onOpenCertificate }) => {
  const t = TRANSLATIONS[currentLang];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredCategories = SKILL_CATEGORIES.map(cat => ({
    ...cat,
    skills: cat.skills.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => {
    if (selectedCategory !== 'all' && cat.title !== selectedCategory) return false;
    return cat.skills.length > 0;
  });

  return (
    <div className="space-y-10">
      
      {/* Introduction Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {currentLang === 'fr' ? 'Compétences Techniques & Cursus Ingénieur' : currentLang === 'pt' ? 'Competências Técnicas & Matriz Académica' : 'Technical Competence & Academic Matrix'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {currentLang === 'fr' ? 'Répartition des compétences pratiques, outils et modules universitaires.' : currentLang === 'pt' ? 'Mapeamento detalhado de competências práticas, ferramentas e unidades curriculares.' : 'Structured breakdown of hands-on technical skills, tools, and university engineering coursework.'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={currentLang === 'fr' ? 'Rechercher (ex: Linux, SQL, SOC)...' : currentLang === 'pt' ? 'Pesquisar (ex: Linux, SQL, SOC)...' : 'Search skills (e.g., Linux, SQL, SOC)...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer ${
            selectedCategory === 'all' 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          {currentLang === 'fr' ? 'Tous les Domaines' : currentLang === 'pt' ? 'Todos os Domínios' : 'All Domains'}
        </button>
        {SKILL_CATEGORIES.map(cat => (
          <button
            key={cat.title}
            onClick={() => setSelectedCategory(cat.title)}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer ${
              selectedCategory === cat.title 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCategories.map((cat, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                {cat.title.includes('Security') && <Shield className="w-4 h-4 text-blue-400" />}
                {cat.title.includes('AI') && <Database className="w-4 h-4 text-emerald-400" />}
                {cat.title.includes('Programming') && <Code className="w-4 h-4 text-purple-400" />}
                {cat.title.includes('Tools') && <Terminal className="w-4 h-4 text-amber-400" />}
                <span>{cat.title}</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono tabular-nums">
                {cat.skills.length} skills
              </span>
            </div>

            <div className="space-y-2.5">
              {cat.skills.map((skill, sIdx) => (
                <div 
                  key={sIdx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="text-xs font-medium text-slate-200">{skill.name}</span>
                  </div>
                  {skill.level && (
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {skill.level}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Engineering Coursework Details */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <span>{currentLang === 'fr' ? 'Modules d\'Ingénierie Informatique & Sécurité' : currentLang === 'pt' ? 'Unidades Curriculares de Engenharia Informática & Cibersegurança' : 'Academic Coursework for IT Security & Systems Engineering'}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Universidade Aberta — {currentLang === 'fr' ? 'Licence en Ingénierie Informatique (Diplôme prévu en Janvier 2027)' : currentLang === 'pt' ? 'Licenciatura em Engenharia Informática (Conclusão prevista para Janeiro de 2027)' : "Bachelor's in Computer Engineering (Expected completion: January 2027)"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {EDUCATION_LIST[0].coursework?.map((course, idx) => (
            <div 
              key={idx}
              className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-blue-500/40 transition-colors flex items-center gap-2.5"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
              <span className="text-xs font-medium text-slate-300">{course}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Official Standards & DigComp Breakdown */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-white text-base">
              Digital Competence Framework (DigComp)
            </h3>
            <p className="text-xs text-slate-400">
              {currentLang === 'fr' ? 'Cadre européen certifiant des compétences opérationnelles avancées.' : currentLang === 'pt' ? 'Padrão europeu de avaliação de competências digitais avançadas.' : 'European standard assessment certifying advanced operational proficiency.'}
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1 rounded-lg">
              {DIGITAL_COMPETENCE.level}
            </span>
            {onOpenCertificate && (
              <button
                onClick={() => onOpenCertificate('digcomp')}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-700/60 rounded-lg transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{currentLang === 'pt' ? 'Ver Relatório Oficial' : 'View Report'}</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-slate-300">
          {DIGITAL_COMPETENCE.domains.map((domain, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{domain}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
