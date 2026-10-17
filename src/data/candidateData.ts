export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  duration: string;
  category: 'it-security' | 'data-quality' | 'web-it';
  isLuxembourg: boolean;
  highlights: string[];
  technologies?: string[];
}

export interface Education {
  institution: string;
  degree: string;
  status: string;
  details?: string;
  coursework?: string[];
}

export interface Training {
  title: string;
  institution: string;
  duration: string;
  completionDate: string;
  details: string;
}

export interface SkillCategory {
  title: string;
  skills: { name: string; level?: 'Advanced' | 'Intermediate' | 'Proficient'; tag?: string }[];
}

export interface Language {
  name: string;
  proficiency: string;
  levelCode: string;
  percentage: number;
}

export const CANDIDATE_PROFILE = {
  name: "Martina Morais da Silva",
  headline: "Junior IT • Security • AI & Data",
  subheadline: "Finalista de Engenharia Informática (a terminar a universidade em Janeiro de 2027) com estágios e experiência prática em Suporte de TI, Qualidade de Dados e Segurança no Luxemburgo.",
  location: "Esch-sur-Alzette, Luxembourg",
  phone: "+352 691 329 414",
  email: "tinasil96@hotmail.com",
  currentDegree: "Licenciatura em Engenharia Informática (Universidade Aberta)",
  graduationExpected: "Término da Universidade: Janeiro de 2027",
  graduationExpectedEn: "University Graduation: January 2027",
  openTo: [
    "Oportunidades Júnior & Trainee",
    "IT Security / Cibersegurança / SOC",
    "Operações de IA & Qualidade de Dados",
    "Suporte de TI & Back Office de Sistemas"
  ],
  drivingLicense: "Category B",
  workAuthorization: "EU Citizen / Full Work Authorization in Luxembourg & EU",
  portraitUrl: "",
  bannerUrl: "/src/assets/images/tech_security_banner_1791195867212.jpg",
  summary: `Finalista da Licenciatura em Engenharia Informática na Universidade Aberta (com conclusão da universidade prevista para Janeiro de 2027) e formação técnica de base em Sistemas e Tecnologias de Computadores. Possuo experiência prática através de estágios e funções em Suporte de TI, Back Office, análise de dados e controlo de qualidade no Luxemburgo (na S.A. ITX e na Tetrao). Procuro oportunidades em regime Júnior ou Trainee em Cibersegurança, SOC, IA, Dados e Suporte de TI, onde possa aplicar o meu rigor analítico, a minha dedicação e a vontade contínua de aprender e evoluir em equipa.`
};

export const EXPERIENCES: Experience[] = [
  {
    id: "itx-luxembourg",
    role: "IT Back Office / IT Support",
    company: "S.A. ITX Luxembourg",
    location: "Luxembourg",
    period: "2022",
    duration: "6 months",
    category: "it-security",
    isLuxembourg: true,
    highlights: [
      "Provided technical support to internal users and assisted with IT infrastructure operations.",
      "Troubleshot system, account, and access-related issues in a corporate environment.",
      "Supported system stability and operational continuity.",
      "Documented IT incidents, operational workflows, and standard procedures.",
      "Collaborated with other IT teams to support reliable, security-conscious IT operations."
    ],
    technologies: ["Systems & Access Management", "Incident Documentation", "Windows/Linux", "Account Security"]
  },
  {
    id: "tetrao-luxembourg",
    role: "Intern — Annotation, Analysis & Quality Control",
    company: "Tetrao",
    location: "Luxembourg",
    period: "2021",
    duration: "6 months",
    category: "data-quality",
    isLuxembourg: true,
    highlights: [
      "Analysed and quality-checked sensitive financial documentation, including funds, bonds, and financial records.",
      "Maintained exceptionally high standards of data accuracy and structural consistency.",
      "Prioritised critical tasks according to shifting workload and business objectives.",
      "Identified process-improvement opportunities and contributed directly to workflow optimisation.",
      "Participated actively in improvements to internal AI annotation software and validation tooling."
    ],
    technologies: ["Financial Data Quality", "Data Annotation & Validation", "Process Optimisation", "SQL & Excel"]
  },
  {
    id: "srg-portugal",
    role: "Web Development / IT Support",
    company: "SRG, Unipessoal Lda.",
    location: "Portugal",
    period: "2019 – 2020",
    duration: "1 year",
    category: "web-it",
    isLuxembourg: false,
    highlights: [
      "Web development and IT technical support for corporate applications.",
      "Maintained system accessibility and assisted user queries across digital channels.",
      "Troubleshot web applications, databases, and network connectivity."
    ],
    technologies: ["JavaScript", "PHP", "Web Development", "IT Troubleshooting"]
  },
  {
    id: "notalab-portugal",
    role: "Web Development / Data Management",
    company: "Notalab – Centro de Assistência Técnica Lda.",
    location: "Portugal",
    period: "2018 – 2019",
    duration: "6 months",
    category: "web-it",
    isLuxembourg: false,
    highlights: [
      "Web development, technical maintenance, and data management systems support.",
      "Ensured data consistency across customer service tracking systems."
    ],
    technologies: ["Data Management", "Web Maintenance", "Technical Support"]
  },
  {
    id: "samsung-service-portugal",
    role: "Web Development / Data Management",
    company: "Samsung Service",
    location: "Portugal",
    period: "2018 – 2019",
    duration: "3 months",
    category: "web-it",
    isLuxembourg: false,
    highlights: [
      "Handled web development tasks and service center data management operations.",
      "Ensured accurate equipment records, service logs, and fast internal turnaround."
    ],
    technologies: ["Data Management", "Log Records", "Internal Operations"]
  },
  {
    id: "bitrepair-portugal",
    role: "Data Management Support",
    company: "Bitrepair, Unipessoal Lda.",
    location: "Portugal",
    period: "2017 – 2018",
    duration: "3 months",
    category: "web-it",
    isLuxembourg: false,
    highlights: [
      "Data management support, verification, and hardware service records organization."
    ],
    technologies: ["Data Support", "Documentation", "Inventory Data"]
  }
];

export const EDUCATION_LIST: Education[] = [
  {
    institution: "Universidade Aberta",
    degree: "Licenciatura em Engenharia Informática (Bachelor's Degree in Computer Engineering)",
    status: "Finalista • Conclusão Prevista da Universidade: Janeiro de 2027 (Expected Graduation: January 2027)",
    details: "Formação universitária em engenharia informática com foco em segurança de redes e sistemas, sistemas operativos, bases de dados, inteligência artificial e engenharia de software.",
    coursework: [
      "Computer and Network Security (Segurança de Redes e Computadores)",
      "Operating Systems (Sistemas Operativos)",
      "Computer Networks (Redes de Computadores)",
      "Distributed Systems (Sistemas Distribuídos)",
      "Database Management Systems (Sistemas de Gestão de Bases de Dados)",
      "Database Fundamentals (Fundamentos de Bases de Dados)",
      "Introduction to Artificial Intelligence (Introdução à Inteligência Artificial)",
      "Programming Languages (Linguagens de Programação)",
      "Object-Oriented Programming (Programação Orientada a Objetos)",
      "Software Development Laboratory (Laboratório de Desenvolvimento de Software)",
      "Computer Engineering Project (Projeto de Engenharia Informática)"
    ]
  },
  {
    institution: "ITA – Institute of Advanced Technologies",
    degree: "Curso Técnico Profissional de Tecnologias e Sistemas de Computadores",
    status: "Concluído",
    details: "Curso técnico de base em arquitetura de computadores, redes e sistemas informáticos."
  }
];

export const CERTIFICATIONS: Training[] = [
  {
    title: "AI and Learning: Understand, Use and Evaluate",
    institution: "Universidade Aberta",
    duration: "26 hours (1 ECTS)",
    completionDate: "July 2026",
    details: "Practical and conceptual framework for understanding artificial intelligence, evaluating AI outputs, algorithmic bias, model limitations, and real-world deployment in professional contexts."
  }
];

export const DIGITAL_COMPETENCE = {
  framework: "DigComp (European Digital Competence Framework)",
  level: "Advanced (Level 6)",
  domains: [
    "Information and data literacy",
    "Communication and collaboration",
    "Digital content creation",
    "Safety & cybersecurity awareness",
    "Complex technical problem solving"
  ]
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "IT & Security Foundations",
    skills: [
      { name: "IT Support & Troubleshooting", level: "Advanced" },
      { name: "Systems & Access Management", level: "Proficient" },
      { name: "Incident Documentation", level: "Advanced" },
      { name: "Log Review & Auditing", level: "Proficient" },
      { name: "Information Security Awareness", level: "Advanced" },
      { name: "Phishing & Suspicious-Email Recognition", level: "Advanced" },
      { name: "Data Protection & Privacy (GDPR Awareness)", level: "Proficient" },
      { name: "Windows Server & Desktop", level: "Advanced" },
      { name: "Linux Fundamentals", level: "Proficient" }
    ]
  },
  {
    title: "AI, Data & Quality Control",
    skills: [
      { name: "Data Analysis & Synthesis", level: "Advanced" },
      { name: "Data Quality & Validation", level: "Advanced" },
      { name: "Annotation & Quality Control", level: "Advanced" },
      { name: "Workflow & Process Optimisation", level: "Advanced" },
      { name: "AI Fundamentals & Model Evaluation", level: "Proficient" },
      { name: "Microsoft Excel (Advanced, Formulas, Pivot)", level: "Advanced" },
      { name: "SQL & Relational Databases (MySQL)", level: "Proficient" }
    ]
  },
  {
    title: "Programming & Web Technologies",
    skills: [
      { name: "JavaScript", level: "Proficient" },
      { name: "PHP", level: "Proficient" },
      { name: "C / C++", level: "Intermediate" },
      { name: "Web Development", level: "Advanced" },
      { name: "WordPress", level: "Advanced" },
      { name: "Object-Oriented Programming (OOP)", level: "Advanced" }
    ]
  },
  {
    title: "Tools & Professional Environments",
    skills: [
      { name: "Microsoft 365 / Office Suite", level: "Advanced" },
      { name: "Notion & Knowledge Base", level: "Advanced" },
      { name: "Adobe Photoshop", level: "Intermediate" },
      { name: "Incident Ticket Systems", level: "Proficient" }
    ]
  }
];

export const LANGUAGES: Language[] = [
  { name: "Portuguese", proficiency: "Native", levelCode: "C2 (Native)", percentage: 100 },
  { name: "English", proficiency: "Fluent", levelCode: "C1 (Fluent)", percentage: 92 },
  { name: "French", proficiency: "Intermediate", levelCode: "B1/B2 (Intermediate)", percentage: 65 },
  { name: "Spanish", proficiency: "Beginner", levelCode: "A2 (Basic)", percentage: 40 }
];

export const MOTIVATION_LETTERS = {
  en: {
    recipient: "Dear Hiring Manager,",
    subject: "Application for Junior / Trainee Opportunities in IT, Cybersecurity, AI & Data",
    date: "Current Application Dossier",
    body: [
      "I am writing to express my interest in junior and trainee opportunities in IT, Cybersecurity, AI & Data, and related technology roles within your organisation.",
      "I am currently completing a Bachelor’s Degree in Computer Engineering at Universidade Aberta, with expected completion in January 2027. My academic background has provided me with knowledge in computer and network security, operating systems, computer networks, databases, programming, software development, distributed systems, and artificial intelligence.",
      "Alongside my studies, I have gained professional experience in IT Support, IT Back Office, data management, data analysis, annotation, and quality control. In my previous IT Support role, I provided technical assistance to internal users, handled system and access-related issues, documented incidents and procedures, and worked with IT teams to support reliable day-to-day operations. I also gained experience in data quality and analysis while working with sensitive financial documentation, where accuracy, consistency, attention to detail, and process optimisation were essential.",
      "I am particularly interested in developing my career at the intersection of technology, cybersecurity, data, and artificial intelligence. My recent training, “AI and Learning: Understand, Use and Evaluate”, completed at Universidade Aberta in 2026, has further strengthened my interest in understanding and applying AI in professional environments.",
      "I consider myself analytical, detail-oriented, adaptable, and motivated to learn. I enjoy solving technical problems, working with data and technology, and continuously developing my knowledge. I am especially interested in opportunities where I can combine my existing IT experience with my academic background while gaining practical experience in new areas such as cybersecurity, AI, data, automation, and technology operations.",
      "I would welcome the opportunity to contribute to your organisation while continuing to develop my technical and professional skills. I am open to junior and trainee positions and motivated to grow within a collaborative and technology-focused environment.",
      "Thank you for considering my application. I would be pleased to discuss my profile and motivation in more detail during an interview."
    ],
    closing: "Yours sincerely,",
    signoff: {
      name: "Martina Morais da Silva",
      location: "Esch-sur-Alzette, Luxembourg",
      phone: "+352 691 329 414",
      email: "tinasil96@hotmail.com"
    }
  },
  pt: {
    recipient: "Exmo(a). Responsável pelo Recrutamento,",
    subject: "Candidatura a Oportunidades Júnior / Trainee em TI, Cibersegurança, IA & Dados",
    date: "Dossiê de Candidatura Atualizado",
    body: [
      "Venho por este meio manifestar o meu elevado interesse em oportunidades júnior e de trainee nas áreas de Tecnologias de Informação (TI), Cibersegurança, Inteligência Artificial e Dados, bem como em funções tecnológicas correlatas na vossa organização.",
      "Encontro-me atualmente a concluir a Licenciatura em Engenharia Informática na Universidade Aberta, com conclusão prevista para janeiro de 2027. O meu percurso académico proporcionou-me sólidos conhecimentos em segurança de redes e sistemas, sistemas operativos, redes de computadores, bases de dados, programação, desenvolvimento de software, sistemas distribuídos e inteligência artificial.",
      "Em paralelo com os meus estudos, consolidei experiência profissional em Suporte de TI, Back Office de TI, gestão e análise de dados, anotação e controlo de qualidade. Na minha experiência prévia de suporte técnico em ambiente empresarial no Luxemburgo, prestei assistência técnica a utilizadores internos, resolvi incidentes ao nível de sistemas e permissões de acesso, documentei processos e procedimentos e colaborei ativamente com as equipas de TI para assegurar a continuidade operacional e a segurança dos sistemas. Adicionalmente, adquiri experiência em qualidade de dados no tratamento de documentação financeira sensível (fundos, obrigações e registos financeiros), onde o rigor analítico, a precisão e a otimização de fluxos foram pilares fundamentais.",
      "Tenho um interesse particular em desenvolver a minha carreira no cruzamento entre tecnologia, cibersegurança, dados e inteligência artificial. A recente formação 'IA e Aprendizagem: Compreender, Utilizar e Avaliar', concluída na Universidade Aberta em 2026, fortaleceu ainda mais a minha visão sobre a aplicação prática e consciente de IA em contexto empresarial.",
      "Considero-me uma profissional analítica, atenta aos detalhes, adaptável e com forte vontade de aprender. Gosto de resolver desafios técnicos, lidar com dados e sistemas e expandir continuamente as minhas competências. Procuro uma oportunidade onde possa aliar a minha experiência prática de TI ao meu percurso académico, integrando novas áreas como cibersegurança (SOC), IA, automação e operações tecnológicas.",
      "Teria enorme satisfação em contribuir para a vossa equipa enquanto continuo a potenciar o meu desenvolvimento técnico e profissional. Estou totalmente disponível para posições de nível júnior / trainee e altamente motivada para evoluir num ambiente colaborativo e orientado à inovação.",
      "Agradeço desde já a atenção dispensada e encontro-me inteiramente à disposição para aprofundar o meu perfil e motivação numa entrevista."
    ],
    closing: "Com os melhores cumprimentos,",
    signoff: {
      name: "Martina Morais da Silva",
      location: "Esch-sur-Alzette, Luxemburgo",
      phone: "+352 691 329 414",
      email: "tinasil96@hotmail.com"
    }
  }
};

export const RECRUITER_ROLES = [
  {
    id: "soc-cybersecurity",
    title: "Junior SOC Analyst / IT Security Trainee",
    shortDesc: "Log review, incident response, network security, phishing prevention & access governance.",
    matchScore: "98% Fit",
    whyHire: [
      "Solid academic foundation in Computer & Network Security and Distributed Systems (Universidade Aberta).",
      "Hands-on corporate experience in systems access management and incident documentation at S.A. ITX Luxembourg.",
      "Trained in phishing recognition, log review, suspicious-email detection, and security awareness.",
      "DigComp Advanced Level 6 certification with strong problem-solving and safety competencies."
    ],
    keyCourses: ["Computer and Network Security", "Operating Systems", "Computer Networks", "Distributed Systems"],
    matchedSkills: ["Incident Documentation", "Log Review", "Access Management", "Phishing Recognition", "Linux Fundamentals"]
  },
  {
    id: "it-support-backoffice",
    title: "IT Support / Systems Back Office Specialist",
    shortDesc: "Technical support, user accounts, operational continuity, process documentation & stability.",
    matchScore: "100% Fit",
    whyHire: [
      "Direct proven experience at S.A. ITX Luxembourg supporting internal corporate users and infrastructure.",
      "Proven ability to troubleshoot system, user account, and credential issues calmly and reliably.",
      "Authored incident documentation, procedural manuals, and collaborative workflows.",
      "Multilingual communicator: Portuguese (Native), English (Fluent), French (Intermediate)."
    ],
    keyCourses: ["Operating Systems", "Computer Networks", "Database Fundamentals", "Software Development Lab"],
    matchedSkills: ["IT Support & Troubleshooting", "Systems & Access Management", "Incident Documentation", "Windows/Linux", "Microsoft Office"]
  },
  {
    id: "ai-data-ops",
    title: "AI Operations & Data Quality Specialist",
    shortDesc: "Financial data validation, annotation workflows, prompt evaluation, Excel & SQL queries.",
    matchScore: "96% Fit",
    whyHire: [
      "6 months at Tetrao Luxembourg analyzing and validating sensitive financial documentation (funds, bonds, records).",
      "Direct contribution to internal annotation tooling, data accuracy consistency, and workflow optimization.",
      "Certified in 'AI and Learning: Understand, Use and Evaluate' (Universidade Aberta, 2026).",
      "Proficient in SQL/MySQL, advanced Microsoft Excel (pivot, formulas), and systematic quality control."
    ],
    keyCourses: ["Introduction to Artificial Intelligence", "Database Management Systems", "Database Fundamentals"],
    matchedSkills: ["Data Analysis & Quality", "Annotation & Validation", "Workflow Optimisation", "SQL / MySQL", "Advanced Excel"]
  },
  {
    id: "junior-developer",
    title: "Junior Software & Web Engineer",
    shortDesc: "Full-stack web fundamentals, JavaScript, PHP, C/C++, databases and OOP architecture.",
    matchScore: "92% Fit",
    whyHire: [
      "Over 1.5+ years of practical web development and IT technical support in Portugal.",
      "Rigorous Computer Engineering coursework including OOP, Programming Languages, and Engineering Projects.",
      "Familiar with relational schemas, modern JavaScript, PHP, WordPress, and versioned development.",
      "Fast learner capable of adopting modern development pipelines and security-first engineering."
    ],
    keyCourses: ["Programming Languages", "Object-Oriented Programming", "Computer Engineering Project", "Database Management Systems"],
    matchedSkills: ["JavaScript", "PHP", "C / C++", "Web Development", "OOP Fundamentals", "SQL"]
  }
];
