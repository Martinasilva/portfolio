export interface CertificateItem {
  id: string;
  title: string;
  titleEn?: string;
  titleFr?: string;
  institution: string;
  completionDate: string;
  durationOrLevel: string;
  category: 'ai' | 'digcomp' | 'security' | 'it' | 'other';
  description: string;
  verificationCode?: string;
  customUploadedPdfUrl?: string; // Data URL or object URL of uploaded authentic PDF
  fileName?: string;
  isCustom?: boolean;
}

export const INITIAL_CERTIFICATES: CertificateItem[] = [
  {
    id: 'ai-uab',
    title: 'A Inteligência Artificial e a Aprendizagem: Compreender, Utilizar e Avaliar',
    titleEn: 'AI and Learning: Understand, Use and Evaluate',
    titleFr: 'IA et apprentissage : comprendre, utiliser et évaluer',
    institution: 'Universidade Aberta (UAb)',
    completionDate: '29 de julho de 2026',
    durationOrLevel: '1 ECTS (26 horas)',
    category: 'ai',
    description: 'Certificado da Universidade Aberta que confirma a conclusão do curso “Curso de IA e Aprendizagem: Compreender, Usar e Avaliar 2025”, com 26 horas de trabalho, correspondentes a 1 ECTS.',
    verificationCode: 'Certificado de conclusão — Universidade Aberta',
    fileName: 'Certificado_IA_Universidade_Aberta.pdf'
  },
  {
    id: 'digcomp-l6',
    title: 'Quadro Europeu de Competências Digitais (DigComp 2.2) - Nível 6 Avançado',
    titleEn: 'European Digital Competence Framework (DigComp 2.2) - Advanced Level 6',
    titleFr: 'Cadre européen des compétences numériques (DigComp 2.2) - Niveau avancé 6',
    institution: 'DigComp Framework / União Europeia',
    completionDate: '18 de fevereiro de 2026',
    durationOrLevel: 'Nível 6 — Advanced',
    category: 'digcomp',
    description: 'Relatório de autoavaliação de competências digitais baseado no DigComp. O perfil indicado é Advanced, Level 6, nas cinco áreas apresentadas. O próprio relatório esclarece que não é um teste formal e não conduz a uma certificação.',
    verificationCode: 'Relatório de autoavaliação — resultado indicado: Advanced, Level 6',
    fileName: 'Relatorio_DigComp_Nivel_6.pdf'
  }
];

const STORAGE_KEY = 'candidate_certificates_v2';

export function getStoredCertificates(): CertificateItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_CERTIFICATES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to load certificates from localStorage', err);
  }
  return INITIAL_CERTIFICATES;
}

export function saveStoredCertificates(certs: CertificateItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(certs));
  } catch (err) {
    console.warn('LocalStorage save failed, probably size limit with large PDF base64', err);
  }
}
