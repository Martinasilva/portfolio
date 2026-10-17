/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ExecutiveOverview } from './components/ExecutiveOverview';
import { CurriculumVitae } from './components/CurriculumVitae';
import { MotivationLetter } from './components/MotivationLetter';
import { SkillMatrix } from './components/SkillMatrix';
import { RoleFitAnalyzer } from './components/RoleFitAnalyzer';
import { CertificatesSection } from './components/CertificatesSection';
import { CertificateModal } from './components/CertificateModal';
import { ContactModal } from './components/ContactModal';
import { PrintModal } from './components/PrintModal';
import { Footer } from './components/Footer';
import { 
  FileText, Briefcase, GraduationCap, ShieldCheck, 
  UserCheck, Award 
} from 'lucide-react';
import { CANDIDATE_PROFILE } from './data/candidateData';
import { Language, TRANSLATIONS } from './data/i18n';

export default function App() {
  // English is the default language, with instant switch to Français & Português de Portugal
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('soc-cybersecurity');
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState<boolean>(false);
  const [certInitialDoc, setCertInitialDoc] = useState<'ai-cert' | 'digcomp'>('ai-cert');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [printInitialDoc, setPrintInitialDoc] = useState<'cv' | 'letter' | 'certificates'>('cv');

  const t = TRANSLATIONS[currentLang];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const contentEl = document.getElementById('main-dossier-content');
    if (contentEl) {
      const topOffset = contentEl.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  const handleOpenCertificate = (doc: 'ai-cert' | 'digcomp' = 'ai-cert') => {
    setCertInitialDoc(doc);
    setIsCertModalOpen(true);
  };

  const handlePrint = (doc?: 'cv' | 'letter' | 'certificates') => {
    const targetDoc = doc || (activeTab === 'letter' ? 'letter' : activeTab === 'certificates' ? 'certificates' : 'cv');
    setPrintInitialDoc(targetDoc);
    setIsPrintModalOpen(true);
  };

  return (
    <div id="top" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* 3-Zone Top Navigation Bar with Language Switcher */}
      <Header
        currentLang={currentLang}
        onSelectLang={(lang) => setCurrentLang(lang)}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenContact={() => setIsContactOpen(true)}
        onPrint={handlePrint}
        onOpenCertificate={handleOpenCertificate}
      />

      {/* Main Candidate Hero Section (No Print) */}
      <div id="hero-container" className="no-print">
        <Hero
          currentLang={currentLang}
          onSelectTab={handleTabChange}
          onOpenContact={() => setIsContactOpen(true)}
        />
      </div>

      {/* Main Interactive Dossier Container */}
      <main id="main-dossier-content" className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Tab Controls Bar - Soft, spacious, elegant navigation capsule (No Print) */}
        <div className="no-print mb-10 flex justify-center w-full">
          <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800/80 shadow-xl overflow-x-auto max-w-full">
            <button
              onClick={() => handleTabChange('overview')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <UserCheck className="w-4 h-4 text-sky-400" />
              <span>{t.nav.overview}</span>
            </button>

            <button
              onClick={() => handleTabChange('cv')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'cv'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>{t.nav.cv}</span>
            </button>

            <button
              onClick={() => handleTabChange('letter')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'letter'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>{t.nav.letter}</span>
            </button>

            <button
              onClick={() => handleTabChange('certificates')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'certificates'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-amber-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>{t.nav.certificates}</span>
            </button>

            <button
              onClick={() => handleTabChange('skills')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'skills'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>{t.nav.skills}</span>
            </button>

            <button
              onClick={() => handleTabChange('fit')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'fit'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span>{t.nav.fit}</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'overview' && (
          <ExecutiveOverview
            currentLang={currentLang}
            onNavigateTab={handleTabChange}
            onSelectRole={(id) => setSelectedRoleId(id)}
          />
        )}

        {activeTab === 'cv' && (
          <CurriculumVitae
            currentLang={currentLang}
            onPrint={handlePrint}
            onOpenCertificate={handleOpenCertificate}
          />
        )}

        {activeTab === 'letter' && (
          <MotivationLetter
            currentLang={currentLang}
            onSelectLang={(lang) => setCurrentLang(lang)}
            onPrint={handlePrint}
            onOpenContact={() => setIsContactOpen(true)}
          />
        )}

        {activeTab === 'certificates' && (
          <CertificatesSection
            currentLang={currentLang}
          />
        )}

        {activeTab === 'skills' && (
          <SkillMatrix
            currentLang={currentLang}
            onOpenCertificate={handleOpenCertificate}
          />
        )}

        {activeTab === 'fit' && (
          <RoleFitAnalyzer
            currentLang={currentLang}
            selectedRoleId={selectedRoleId}
            onSelectRole={(id) => setSelectedRoleId(id)}
            onOpenContact={() => setIsContactOpen(true)}
          />
        )}

      </main>

      {/* Corporate Quiet Footer */}
      <Footer
        currentLang={currentLang}
        onSelectTab={handleTabChange}
        onOpenContact={() => setIsContactOpen(true)}
        onPrint={handlePrint}
      />

      {/* Interactive Official Certificate Viewer Modal */}
      <CertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        currentLang={currentLang}
        initialDoc={certInitialDoc}
      />

      {/* Recruiter Contact & Schedule Interview Modal */}
      <ContactModal
        currentLang={currentLang}
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* Official A4 Print & PDF Export Modal */}
      <PrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        currentLang={currentLang}
        initialDoc={printInitialDoc}
      />

    </div>
  );
}
