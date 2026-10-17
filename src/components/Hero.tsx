import React, { useState, useRef, useEffect } from 'react';
import { 
  MapPin, Phone, Mail, Check, Copy, ArrowRight, 
  ShieldCheck, Camera, Upload, RotateCcw, Download 
} from 'lucide-react';
import { CANDIDATE_PROFILE } from '../data/candidateData';
import defaultProfilePhoto from '../assets/images/martina-profile.jpg';
import { Language, TRANSLATIONS } from '../data/i18n';
import { getUploadedCV, downloadFileFromUrl } from '../data/documentVault';
import { fetchPortfolioFileDataUrl, uploadPortfolioFile, deletePortfolioFile } from '../data/portfolioCloud';

interface HeroProps {
  currentLang: Language;
  onSelectTab: (tab: string) => void;
  onOpenContact: () => void;
}

export const Hero: React.FC<HeroProps> = ({ currentLang, onSelectTab, onOpenContact }) => {
  const t = TRANSLATIONS[currentLang];
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [customPhoto, setCustomPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load custom photo from localStorage ONLY if it is a real uploaded data URL
  useEffect(() => {
    let active = true;
    const loadPhoto = async () => {
      // Cloudflare is the shared source of truth; local storage is only a fallback.
      const remote = await fetchPortfolioFileDataUrl('profile_photo');
      if (active && remote && remote.startsWith('data:image')) {
        setCustomPhoto(remote);
        try { localStorage.setItem('martina_custom_profile_photo', remote); } catch { /* remote copy remains available */ }
        return;
      }
      const saved = localStorage.getItem('martina_custom_profile_photo');
      if (active && saved && saved.startsWith('data:image')) setCustomPhoto(saved);
    };
    loadPhoto().catch((err) => console.warn('Could not load shared profile photo', err));
    return () => { active = false; };
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Escolhe uma imagem JPG, PNG ou WebP.');
      if (file.size > 4 * 1024 * 1024) throw new Error('The image must be 4 MB or smaller.');
      await uploadPortfolioFile('profile_photo', file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setCustomPhoto(result);
          try { localStorage.setItem('martina_custom_profile_photo', result); } catch { /* remote copy remains available */ }
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Could not upload photo.');
    } finally {
      e.target.value = '';
    }
  };

  const handleResetPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomPhoto(null);
    localStorage.removeItem('martina_custom_profile_photo');
    deletePortfolioFile('profile_photo').catch((err) => console.warn('Could not remove shared photo', err));
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleQuickDownloadCv = async () => {
    const cvDoc = await getUploadedCV();
    if (cvDoc) {
      downloadFileFromUrl(cvDoc.dataUrl, cvDoc.name);
    } else {
      onSelectTab('cv');
    }
  };

  const currentDisplayPhoto = customPhoto && customPhoto.startsWith('data:image') ? customPhoto : defaultProfilePhoto;

  return (
    <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-950 py-10 md:py-16">
      {/* Hidden file input for photo upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Bold Editorial Presentation */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Metadata Line */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-slate-400 font-medium">
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                {t.hero.availabilityBadge}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {t.hero.location}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">{t.hero.euWorkAuth}</span>
            </div>

            {/* Candidate Title & Headline */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {CANDIDATE_PROFILE.name}
              </h1>
              <p className="mt-2 text-lg sm:text-xl font-semibold text-blue-400">
                {t.hero.headline}
              </p>
            </div>

            {/* Clear Editorial Value Pitch */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              {t.hero.pitch}
            </p>

            {/* Recruiter Honest Proof Metrics */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-2 border-t border-slate-800/80">
              <div className="p-2 sm:p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-base sm:text-lg font-bold text-white leading-tight">{t.hero.metric1Val}</div>
                <div className="text-xs text-slate-400 mt-0.5">{t.hero.metric1Label}</div>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-slate-950/60 border border-blue-900/40">
                <div className="text-base sm:text-lg font-bold text-blue-400 leading-tight">{t.hero.metric2Val}</div>
                <div className="text-xs text-slate-400 mt-0.5">{t.hero.metric2Label}</div>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-slate-950/60 border border-emerald-900/40">
                <div className="text-base sm:text-lg font-bold text-emerald-400 leading-tight">{t.hero.metric3Val}</div>
                <div className="text-xs text-slate-400 mt-0.5">{t.hero.metric3Label}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelectTab('letter')}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow-md cursor-pointer"
              >
                <span>{t.hero.readLetterBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleQuickDownloadCv}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-md shadow-emerald-600/20 cursor-pointer"
                title={currentLang === 'pt' ? 'Descarregar o CV oficial de Martina' : 'Download CV file'}
              >
                <Download className="w-4 h-4" />
                <span>{currentLang === 'pt' ? 'Descarregar CV' : currentLang === 'fr' ? 'Télécharger CV' : 'Download CV'}</span>
              </button>

              <button
                onClick={() => onSelectTab('cv')}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-200 bg-slate-800/90 border border-slate-700 rounded-lg hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
              >
                <span>{t.hero.inspectCvBtn}</span>
              </button>

              <button
                onClick={onOpenContact}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 rounded-lg hover:bg-emerald-900/40 transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{t.hero.quickInterviewBtn}</span>
              </button>
            </div>

          </div>

          {/* Right Column: Candidate Dossier Card & Photo Framing */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-2xl backdrop-blur-sm space-y-5">
              
              {/* Photo & Quick Intro with Interactive Photo Uploader */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                
                {/* Photo Frame or Cute Monogram with Click-to-Upload */}
                {currentDisplayPhoto ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    title={t.hero.photoUploadHint}
                    className="relative h-32 w-32 sm:h-36 sm:w-36 rounded-2xl overflow-hidden border-2 border-blue-500/50 shrink-0 bg-slate-800 shadow-xl cursor-pointer group"
                  >
                    <img
                      src={currentDisplayPhoto}
                      alt={CANDIDATE_PROFILE.name}
                      className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs gap-1 p-2">
                      <Camera className="w-5 h-5 text-blue-400" />
                      <span className="font-semibold text-[11px] text-center">{t.hero.changePhotoBtn}</span>
                    </div>

                    <button
                      onClick={handleResetPhoto}
                      title="Reset photo"
                      className="absolute top-1 right-1 p-1 bg-slate-900/90 hover:bg-red-950 text-slate-300 hover:text-red-400 rounded-md transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    title={t.hero.photoUploadHint}
                    className="relative h-32 w-32 sm:h-36 sm:w-36 rounded-2xl border-2 border-dashed border-blue-500/40 bg-gradient-to-br from-slate-900 via-blue-950/20 to-slate-900 shadow-xl flex flex-col items-center justify-center p-3 text-center cursor-pointer group hover:border-blue-400 hover:bg-slate-900/90 transition-all shrink-0"
                  >
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white font-extrabold text-xl shadow-md group-hover:scale-105 transition-transform">
                      MS
                    </div>
                    <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-blue-400 group-hover:text-blue-300">
                      <Camera className="w-3.5 h-3.5" />
                      <span>{t.hero.changePhotoBtn}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {currentLang === 'pt' ? 'Adicionar foto' : currentLang === 'fr' ? 'Ajouter photo' : 'Select photo'}
                    </div>
                  </div>
                )}

                <div className="space-y-1.5 min-w-0">
                  <div className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">{t.hero.candidateCardTag}</div>
                  <h2 className="text-xl font-bold text-white truncate">{CANDIDATE_PROFILE.name}</h2>
                  <p className="text-xs font-medium text-slate-300">{CANDIDATE_PROFILE.headline}</p>
                  <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    <span>{t.hero.location}</span>
                  </p>
                  <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="inline-block text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                      {t.hero.immediateStart}
                    </span>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-400 hover:text-blue-300 underline cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{currentDisplayPhoto ? t.hero.changePhotoBtn : (currentLang === 'pt' ? 'Carregar Foto' : currentLang === 'fr' ? 'Charger Photo' : 'Upload Photo')}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Direct Fast-Access Contact Channels */}
              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                
                {/* Email Item */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-2 text-slate-300 truncate">
                    <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">{CANDIDATE_PROFILE.email}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={`mailto:${CANDIDATE_PROFILE.email}?subject=Job Opportunity / Interview Invitation`}
                      className="px-2 py-1 text-[11px] font-medium text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Email
                    </a>
                    <button
                      onClick={() => handleCopy(CANDIDATE_PROFILE.email, 'email')}
                      className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Copy email"
                    >
                      {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Phone Item */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="font-mono">{CANDIDATE_PROFILE.phone}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={`tel:${CANDIDATE_PROFILE.phone.replace(/\s+/g, '')}`}
                      className="px-2 py-1 text-[11px] font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      Call
                    </a>
                    <button
                      onClick={() => handleCopy(CANDIDATE_PROFILE.phone, 'phone')}
                      className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Copy phone"
                    >
                      {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

              </div>

              {/* Luxembourg Local Advantage Callout */}
              <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-900/40 text-xs text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-blue-300">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{t.hero.localAdvantageTitle}</span>
                </div>
                <p className="text-slate-400 leading-normal">
                  {t.hero.localAdvantageDesc}
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
