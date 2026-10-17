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
    completionDate: '26 de Fevereiro de 2026',
    durationOrLevel: '1 ECTS (26 Horas)',
    category: 'ai',
    description: 'Certificado de Formação Contínua da Universidade Aberta. Abrange compreensão teórica e prática de inteligência artificial, avaliação crítica de resultados gerados por IA, limitações algorítmicas, proteção de dados e aplicação profissional em contexto organizacional.',
    verificationCode: 'Registo UAb: 6904414939MS',
    fileName: 'Certificado_IA_Universidade_Aberta.pdf'
  },
  {
    id: 'digcomp-l6',
    title: 'Relatório de Competências Digitais — DigComp 2.2 (Nível Avançado 6)',
    titleEn: 'European Digital Competence Framework (DigComp 2.2) - Advanced Level 6',
    titleFr: 'Rapport de compétences numériques — DigComp 2.2 (niveau avancé 6)',
    institution: 'DigComp Framework / União Europeia',
    completionDate: '2026',
    durationOrLevel: 'Nível 6 Global (Avançado / Especialista)',
    category: 'digcomp',
    description: 'Relatório oficial do Quadro Europeu de Competências Digitais para Cidadãos (DigComp 2.2). Atingiu o Nível 6 Avançado em todas as cinco áreas-chave: 1. Literacia de informação e dados; 2. Comunicação e colaboração; 3. Criação de conteúdos digitais; 4. Segurança e cibersegurança; 5. Resolução de problemas técnicos.',
    verificationCode: 'Classificação Europass DigComp: Nível 6',
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
