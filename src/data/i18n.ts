export type Language = 'en' | 'fr' | 'pt';

export interface TranslationContent {
  nav: {
    overview: string;
    cv: string;
    letter: string;
    skills: string;
    fit: string;
    certificates: string;
    printPdf: string;
    contactHire: string;
  };
  hero: {
    availabilityBadge: string;
    location: string;
    euWorkAuth: string;
    headline: string;
    pitch: string;
    metric1Val: string;
    metric1Label: string;
    metric2Val: string;
    metric2Label: string;
    metric3Val: string;
    metric3Label: string;
    readLetterBtn: string;
    inspectCvBtn: string;
    quickInterviewBtn: string;
    candidateCardTag: string;
    immediateStart: string;
    localAdvantageTitle: string;
    localAdvantageDesc: string;
    photoUploadHint: string;
    changePhotoBtn: string;
  };
  overview: {
    title: string;
    subtitle: string;
    motivationBtn: string;
    structuredCvBtn: string;
    summary: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar3Title: string;
    pillar3Desc: string;
    pillar4Title: string;
    pillar4Desc: string;
    targetRolesTitle: string;
    targetRolesSubtitle: string;
    openFitAnalyzer: string;
    luxSpotlightTitle: string;
    luxSpotlightSubtitle: string;
    keyFocus: string;
  };
  cv: {
    title: string;
    subtitle: string;
    filterAll: string;
    filterLux: string;
    filterSecurity: string;
    printBtn: string;
    showingCount: string;
    profileHeading: string;
    skillsHeading: string;
    experienceHeading: string;
    educationHeading: string;
    courseworkLabel: string;
    trainingHeading: string;
    digCompHeading: string;
    languagesHeading: string;
    additionalHeading: string;
  };
  letter: {
    title: string;
    subtitle: string;
    copyBtn: string;
    copiedBtn: string;
    printBtn: string;
    calloutTitle: string;
    calloutDesc: string;
    scheduleBtn: string;
    dateLabel: string;
    recipient: string;
    body: string[];
    closing: string;
  };
  fit: {
    badge: string;
    title: string;
    subtitle: string;
    compatibility: string;
    interviewBtn: string;
    whyHireTitle: string;
    academicTitle: string;
    academicDesc: string;
    practicalTitle: string;
    practicalDesc: string;
    localEligibility: string;
    proceedBtn: string;
  };
  contact: {
    channelTag: string;
    title: string;
    subtitle: string;
    emailLabel: string;
    phoneLabel: string;
    locationNote: string;
    formTitle: string;
    nameLabel: string;
    namePlaceholder: string;
    companyLabel: string;
    companyPlaceholder: string;
    roleLabel: string;
    rolePlaceholder: string;
    noteLabel: string;
    notePlaceholder: string;
    openEmailClient: string;
    recordRequest: string;
    successTitle: string;
    successDesc: string;
    sendViaEmailBtn: string;
  };
  footer: {
    tagline: string;
    copyright: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationContent> = {
  en: {
    nav: {
      overview: "Overview",
      cv: "Curriculum Vitae",
      letter: "Motivation Letter",
      skills: "Skill Matrix",
      fit: "Recruiter Match",
      certificates: "Certificates",
      printPdf: "Print / PDF",
      contactHire: "Contact / Hire"
    },
    hero: {
      availabilityBadge: "Available for Junior & Trainee Roles",
      location: "Esch-sur-Alzette, Luxembourg",
      euWorkAuth: "EU Citizen (Full Work Authorization)",
      headline: "Junior IT • Security • AI & Data",
      pitch: "Final-year Bachelor’s student in Computer Engineering at Universidade Aberta, with expected university completion in January 2027. Motivated junior professional with hands-on corporate internships in Luxembourg at S.A. ITX (IT Support & Systems Back Office) and Tetrao (Financial Data Quality & AI Annotation).",
      metric1Val: "Junior / Trainee",
      metric1Label: "Corporate Internships in Lux",
      metric2Val: "January 2027",
      metric2Label: "University Graduation",
      metric3Val: "Level 6 Advanced",
      metric3Label: "DigComp EU Standard",
      readLetterBtn: "Read Motivation Letter",
      inspectCvBtn: "Examine Full CV",
      quickInterviewBtn: "Schedule Interview",
      candidateCardTag: "Candidate Profile • Junior",
      immediateStart: "Immediate Availability",
      localAdvantageTitle: "Local Luxembourg Presence",
      localAdvantageDesc: "Residing in Esch-sur-Alzette with Category B driving licence. Available immediately for in-person interviews and on-site or hybrid positions across Luxembourg.",
      photoUploadHint: "Click to load your real photo from your device",
      changePhotoBtn: "Update Photo"
    },
    overview: {
      title: "Executive Candidate Overview",
      subtitle: "Curated for Luxembourg and international recruiters, hiring managers, and IT engineering leads.",
      motivationBtn: "Motivation Letter",
      structuredCvBtn: "Structured CV",
      summary: "Final-year Bachelor’s Degree student in Computer Engineering at Universidade Aberta (expected graduation in January 2027), with a technical background in Computer Science and Systems. Hands-on experience gained through corporate internships and support roles in Luxembourg at S.A. ITX and Tetrao. Seeking junior and trainee opportunities in Cybersecurity, SOC, AI & Data Operations, and IT Support, offering high analytical rigor, adaptability, and eager commitment to team growth.",
      pillar1Title: "Cybersecurity & SOC",
      pillar1Desc: "Coursework in Network Security, Distributed Systems, and OS. Practical experience in access governance, log review, and incident documentation.",
      pillar2Title: "Financial Data Quality",
      pillar2Desc: "6 months at Tetrao Luxembourg verifying high-stakes fund and bond documentation. Proven accuracy, data consistency, and process optimization.",
      pillar3Title: "AI & Learning",
      pillar3Desc: "Certified in 'AI and Learning: Understand, Use and Evaluate' (Univ. Aberta, 2026). Hands-on with AI annotation tooling, model evaluation, and SQL.",
      pillar4Title: "IT Support & Systems",
      pillar4Desc: "Experience at S.A. ITX Luxembourg supporting internal users, troubleshooting access credentials, and ensuring business continuity.",
      targetRolesTitle: "Target Roles & Team Alignment",
      targetRolesSubtitle: "Explore the roles where Martina's enthusiasm, rigor, and technical background create immediate value for your team:",
      openFitAnalyzer: "Open Candidate Fit Analyzer",
      luxSpotlightTitle: "Luxembourg Experience Spotlight",
      luxSpotlightSubtitle: "Direct experience in high-standard corporate environments within the Grand Duchy.",
      keyFocus: "Key Focus:"
    },
    cv: {
      title: "Curriculum Vitae",
      subtitle: "Professional European format for Martina Morais da Silva",
      filterAll: "All History",
      filterLux: "Luxembourg Experience",
      filterSecurity: "Security & Data Focus",
      printBtn: "Print / Save PDF",
      showingCount: "Showing",
      profileHeading: "Profile",
      skillsHeading: "Technical Skills",
      experienceHeading: "Professional Experience",
      educationHeading: "Education",
      courseworkLabel: "Relevant coursework for IT Security / Cybersecurity:",
      trainingHeading: "Additional Training",
      digCompHeading: "Digital Competence (DigComp)",
      languagesHeading: "Languages",
      additionalHeading: "Additional Information"
    },
    letter: {
      title: "Motivation Letter",
      subtitle: "Official application letter presented in executive business format",
      copyBtn: "Copy Text",
      copiedBtn: "Copied!",
      printBtn: "Print / Save PDF",
      calloutTitle: "Ready to arrange an interview with Martina?",
      calloutDesc: "Prompt response guaranteed for Luxembourg and remote European positions.",
      scheduleBtn: "Schedule Interview Request",
      dateLabel: "Current Application Dossier",
      recipient: "Dear Hiring Manager,",
      body: [
        "I am writing to express my interest in junior and trainee opportunities in IT, Cybersecurity, AI & Data, and related technology roles within your organisation.",
        "I am currently completing a Bachelor’s Degree in Computer Engineering at Universidade Aberta, with expected completion in January 2027. My academic background has provided me with knowledge in computer and network security, operating systems, computer networks, databases, programming, software development, distributed systems, and artificial intelligence.",
        "Alongside my studies, I have gained professional experience in IT Support, IT Back Office, data management, data analysis, annotation, and quality control. In my previous IT Support role, I provided technical assistance to internal users, handled system and access-related issues, documented incidents and procedures, and worked with IT teams to support reliable day-to-day operations. I also gained experience in data quality and analysis while working with sensitive financial documentation, where accuracy, consistency, attention to detail, and process optimisation were essential.",
        "I am particularly interested in developing my career at the intersection of technology, cybersecurity, data, and artificial intelligence. My recent training, “AI and Learning: Understand, Use and Evaluate”, completed at Universidade Aberta in 2026, has further strengthened my interest in understanding and applying AI in professional environments.",
        "I consider myself analytical, detail-oriented, adaptable, and motivated to learn. I enjoy solving technical problems, working with data and technology, and continuously developing my knowledge. I am especially interested in opportunities where I can combine my existing IT experience with my academic background while gaining practical experience in new areas such as cybersecurity, AI, data, automation, and technology operations.",
        "I would welcome the opportunity to contribute to your organisation while continuing to develop my technical and professional skills. I am open to junior and trainee positions and motivated to grow within a collaborative and technology-focused environment.",
        "Thank you for considering my application. I would be pleased to discuss my profile and motivation in more detail during an interview."
      ],
      closing: "Yours sincerely,"
    },
    fit: {
      badge: "Role & Talent Synergy",
      title: "How I Can Contribute to Your Team",
      subtitle: "I’m curious, detail-oriented, and motivated to keep learning. I enjoy understanding how technology works, approaching problems thoughtfully, and finding practical solutions. I’d welcome the opportunity to contribute with care and commitment while learning from the people around me.",
      compatibility: "Profile Alignment",
      interviewBtn: "Schedule a Conversation",
      whyHireTitle: "Key Strengths & Value for Your Team",
      academicTitle: "Academic Foundations & Knowledge",
      academicDesc: "Validated university curriculum completed at Universidade Aberta:",
      practicalTitle: "Applied Technical Skills",
      practicalDesc: "Hands-on tools and methodologies applied in corporate and technical tasks:",
      localEligibility: "Based in Esch-sur-Alzette, Luxembourg · Driving licence B · Available immediately.",
      proceedBtn: "Invite for an Interview"
    },
    contact: {
      channelTag: "Direct Candidate Channel",
      title: "Schedule an Interview with Martina",
      subtitle: "Available immediately for junior, trainee, or graduate roles in Luxembourg & remote EU.",
      emailLabel: "Email Address",
      phoneLabel: "Direct Phone",
      locationNote: "Esch-sur-Alzette, Luxembourg · EU Citizen with full local employment authorization and driving licence (Category B).",
      formTitle: "Send Quick Interview Request",
      nameLabel: "Your Name / Title",
      namePlaceholder: "e.g. Marc Weber (Talent Lead)",
      companyLabel: "Company / Organization",
      companyPlaceholder: "e.g. Luxembourg Tech / Bank",
      roleLabel: "Target Position",
      rolePlaceholder: "e.g. Junior SOC Analyst / IT Support Specialist",
      noteLabel: "Note or Proposed Dates",
      notePlaceholder: "We would like to invite you for a 30-minute introductory call...",
      openEmailClient: "Open in Your Email Client",
      recordRequest: "Record Request Here",
      successTitle: "Interview Request Recorded",
      successDesc: "Thank you for your interest! You can also contact Martina directly anytime via email or phone.",
      sendViaEmailBtn: "Send via Email Client"
    },
    footer: {
      tagline: "Professional Application Dossier",
      copyright: "All rights reserved."
    }
  },
  fr: {
      nav: {
        overview: "Aperçu",
        cv: "Curriculum Vitae",
        letter: "Lettre de Motivation",
        skills: "Matrice de Compétences",
        fit: "Adéquation Recruteur",
        certificates: "Certificats",
        printPdf: "Imprimer / PDF",
        contactHire: "Contacter / Recruter"
      },
      hero: {
        availabilityBadge: "Disponible pour Postes Junior & Trainee",
        location: "Esch-sur-Alzette, Luxembourg",
        euWorkAuth: "Citoyenne UE (Autorisation de Travail Complète)",
        headline: "Junior IT • Sécurité • IA & Données",
        pitch: "Étudiante en dernière année de Bachelor en Ingénierie Informatique à l'Universidade Aberta, fin d'études universitaires prévue en Janvier 2027. Profil junior dynamique avec des stages en entreprise au Luxembourg chez S.A. ITX (Support IT & Back Office) et Tetrao (Qualité des Données Financières & Annotation IA).",
        metric1Val: "Junior / Trainee",
        metric1Label: "Stages en Entreprise au Lux",
        metric2Val: "Janvier 2027",
        metric2Label: "Diplôme Universitaire",
        metric3Val: "Niveau 6 Avancé",
        metric3Label: "Référentiel DigComp UE",
        readLetterBtn: "Lire la Lettre de Motivation",
        inspectCvBtn: "Consulter le CV",
        quickInterviewBtn: "Planifier un Entretien",
        candidateCardTag: "Dossier Candidature • Junior",
        immediateStart: "Disponibilité Immédiate",
        localAdvantageTitle: "Présence Locale au Luxembourg",
        localAdvantageDesc: "Résidant à Esch-sur-Alzette avec permis de conduire (Catégorie B). Immédiatement disponible pour entretiens en personne et postes sur site ou hybrides au Luxembourg.",
        photoUploadHint: "Cliquez pour charger votre photo réelle",
        changePhotoBtn: "Changer la Photo"
      },
      overview: {
        title: "Synthèse Exécutive de la Candidate",
        subtitle: "Conçue pour les recruteurs, DRH et responsables techniques au Luxembourg et à l'international.",
        motivationBtn: "Lettre de Motivation",
        structuredCvBtn: "CV Structuré",
        summary: "Étudiante finaliste en Ingénierie Informatique à l'Universidade Aberta (diplôme prévu en Janvier 2027), avec une formation technique en Systèmes Informatiques. Expérience concrète acquise lors de stages et fonctions au Luxembourg chez S.A. ITX et Tetrao. À la recherche d'opportunités de niveau Junior ou Trainee en Cybersécurité, SOC, IA & Données et Support IT, avec une grande rigueur analytique et une volonté constante d'apprendre.",
        pillar1Title: "Cybersécurité & SOC",
        pillar1Desc: "Modules en Sécurité des Réseaux, Systèmes Distribués et OS. Pratique de la gestion des accès, revue des logs et documentation des incidents.",
        pillar2Title: "Qualité des Données Financières",
        pillar2Desc: "6 mois chez Tetrao Luxembourg à vérifier des documents financiers sensibles (fonds, obligations). Rigueur absolue et optimisation des processus.",
        pillar3Title: "IA & Apprentissage",
        pillar3Desc: "Certifiée en 'IA et Apprentissage' (Univ. Aberta, 2026). Pratique des outils d'annotation IA, évaluation de modèles et requêtes SQL.",
        pillar4Title: "Support IT & Systèmes",
        pillar4Desc: "Expérience chez S.A. ITX Luxembourg en assistance aux utilisateurs internes, résolution des accès et continuité opérationnelle.",
        targetRolesTitle: "Postes Cibles & Compatibilité",
        targetRolesSubtitle: "Sélectionnez votre opportunité pour voir l'adéquation exacte avec le profil de Martina :",
        openFitAnalyzer: "Ouvrir l'Analyseur d'Adéquation",
        luxSpotlightTitle: "Expérience Concrète au Luxembourg",
        luxSpotlightSubtitle: "Parcours vérifié au sein d'entreprises réputées du Grand-Duché.",
        keyFocus: "Domaines clés :"
      },
      cv: {
        title: "Curriculum Vitae",
        subtitle: "Format professionnel européen pour Martina Morais da Silva",
        filterAll: "Tout l'Historique",
        filterLux: "Expérience Luxembourg",
        filterSecurity: "Sécurité & Données",
        printBtn: "Imprimer / Enregistrer PDF",
        showingCount: "Affichage de",
        profileHeading: "Profil",
        skillsHeading: "Compétences Techniques",
        experienceHeading: "Expérience Professionnelle",
        educationHeading: "Formation & Diplômes",
        courseworkLabel: "Modules universitaires pertinents pour la Sécurité IT / Cybersécurité :",
        trainingHeading: "Formations Complémentaires",
        digCompHeading: "Compétences Numériques (DigComp)",
        languagesHeading: "Langues",
        additionalHeading: "Informations Complémentaires"
      },
      letter: {
        title: "Lettre de Motivation",
        subtitle: "Candidature officielle présentée au format exécutif d'affaires",
        copyBtn: "Copier le Texte",
        copiedBtn: "Copié !",
        printBtn: "Imprimer / PDF",
        calloutTitle: "Souhaitez-vous organiser un entretien avec Martina ?",
        calloutDesc: "Réponse rapide garantie pour opportunités au Luxembourg ou en télétravail.",
        scheduleBtn: "Demander un Entretien",
        dateLabel: "Dossier de Candidature Actuel",
        recipient: "Madame, Monsieur le Responsable du Recrutement,",
        body: [
          "Je vous adresse ma candidature pour exprimer mon vif intérêt pour des opportunités de niveau junior ou trainee en Informatique, Cybersécurité, IA & Données au sein de votre organisation.",
          "Je termine actuellement ma Licence en Ingénierie Informatique à l'Universidade Aberta, avec une fin d'études prévue pour Janvier 2027. Ma formation académique m'a permis d'acquérir de solides bases en sécurité des réseaux et des ordinateurs, systèmes d'exploitation, bases de données, programmation, systèmes distribués et intelligence artificielle.",
          "En parallèle de mes études, j'ai développé une expérience pratique au Luxembourg en Support IT, Back Office, gestion et analyse de données, ainsi qu'en contrôle qualité. Lors de ma mission de support chez S.A. ITX au Luxembourg, j'ai assuré l'assistance technique aux utilisateurs internes, résolu les incidents liés aux comptes et aux accès, rédigé la documentation technique et veillé à la continuité des opérations. Chez Tetrao au Luxembourg, j'ai analysé et vérifié des documents financiers sensibles (fonds, obligations), où la rigueur, l'exactitude et l'optimisation des flux étaient indispensables.",
          "Je souhaite particulièrement orienter ma carrière au croisement de la technologie, de la cybersécurité, des données et de l'intelligence artificielle. Ma formation récente 'IA et Apprentissage : Comprendre, Utiliser et Évaluer' (Univ. Aberta, 2026) a consolidé mes compétences pratiques pour intégrer l'IA en milieu professionnel.",
          "Analytique, rigoureuse et adaptable, j'aime résoudre des problèmes techniques et développer continuellement mes connaissances. Je souhaite apporter ma motivation et mes acquis à une équipe dynamique tout en montant en compétences dans des domaines tels que le SOC, la cybersécurité, l'IA et l'automatisation.",
          "Je serais honorée de contribuer à vos projets et me tiens à votre entière disposition pour échanger de vive voix lors d'un entretien.",
          "En vous remerciant pour l'attention portée à ma candidature, je vous prie d'agréer mes salutations distinguées."
        ],
        closing: "Cordialement,"
      },
      fit: {
        badge: "Synergie Profil & Opportunités",
        title: "Comment je peux contribuer à votre équipe",
        subtitle: "Curieuse, attentive aux détails et motivée à apprendre, j’aime comprendre le fonctionnement des technologies, aborder les problèmes avec réflexion et chercher des solutions concrètes. Je serais ravie de contribuer avec sérieux et engagement, tout en apprenant auprès de l’équipe.",
        compatibility: "Adéquation du Profil",
        interviewBtn: "Planifier un Échange",
        whyHireTitle: "Pourquoi Martina est un Atout Immédiat",
        academicTitle: "Fondements Académiques Universitaires",
        academicDesc: "Modules universitaires validés à l'Universidade Aberta :",
        practicalTitle: "Compétences Pratiques Appliquées",
        practicalDesc: "Outils et méthodologies éprouvés en entreprise et en laboratoire :",
        localEligibility: "Basée à Esch-sur-Alzette, Luxembourg · Permis B · Disponibilité immédiate.",
        proceedBtn: "Inviter à un Entretien"
      },
      contact: {
        channelTag: "Canal Direct Candidat",
        title: "Organiser un Entretien avec Martina",
        subtitle: "Disponible immédiatement pour des postes junior, trainee ou d'insertion professionnelle au Luxembourg.",
        emailLabel: "Adresse E-mail",
        phoneLabel: "Téléphone Direct",
        locationNote: "Esch-sur-Alzette, Luxembourg · Citoyenne européenne avec permis B et autorisation de travail immédiate.",
        formTitle: "Envoyer une Demande d'Entretien",
        nameLabel: "Votre Nom / Fonction",
        namePlaceholder: "ex. Marc Weber (Responsable Recrutement)",
        companyLabel: "Entreprise / Organisation",
        companyPlaceholder: "ex. Banque / Société IT Luxembourg",
        roleLabel: "Poste Proposé",
        rolePlaceholder: "ex. Analyste SOC Junior / Technicien Support IT",
        noteLabel: "Message ou Dates Souhaitées",
        notePlaceholder: "Nous souhaiterions vous rencontrer pour un échange de 30 minutes...",
        openEmailClient: "Ouvrir dans votre Messagerie",
        recordRequest: "Enregistrer la Demande",
        successTitle: "Demande d'Entretien Enregistrée",
        successDesc: "Merci pour votre intérêt ! Vous pouvez contacter Martina directement par e-mail ou par téléphone.",
        sendViaEmailBtn: "Envoyer par E-mail"
      },
      footer: {
        tagline: "Dossier de Candidature Professionnel",
        copyright: "Tous droits réservés."
      }
    },
    pt: {
      nav: {
        overview: "Visão Geral",
        cv: "Curriculum Vitae",
        letter: "Carta de Motivação",
        skills: "Matriz de Competências",
        fit: "Correspondência de Perfil",
        certificates: "Certificados",
        printPdf: "Imprimir / PDF",
        contactHire: "Contactar / Recrutar"
      },
      hero: {
        availabilityBadge: "Disponível para Posições Júnior & Trainee",
        location: "Esch-sur-Alzette, Luxemburgo",
        euWorkAuth: "Cidadã da UE (Autorização de Trabalho Total)",
        headline: "Junior IT • Security • AI & Data",
        pitch: "Finalista da Licenciatura em Engenharia Informática na Universidade Aberta, com conclusão da universidade prevista para Janeiro de 2027. Perfil júnior dedicado e motivado com experiência prática de estágios em empresas no Luxemburgo na S.A. ITX (Suporte de TI e Back Office) e na Tetrao (Controlo de Qualidade de Dados Financeiros e Anotação de IA).",
        metric1Val: "Júnior / Trainee",
        metric1Label: "Estágios Práticos no Luxemburgo",
        metric2Val: "Janeiro de 2027",
        metric2Label: "Fim da Universidade",
        metric3Val: "Nível 6 Avançado",
        metric3Label: "DigComp Europeu",
        readLetterBtn: "Ler Carta de Motivação",
        inspectCvBtn: "Ver CV Completo",
        quickInterviewBtn: "Agendar Entrevista",
        candidateCardTag: "Dossiê da Candidata • Perfil Júnior",
        immediateStart: "Disponibilidade Imediata",
        localAdvantageTitle: "Residência no Luxemburgo",
        localAdvantageDesc: "A residir em Esch-sur-Alzette com carta de condução (Categoria B). Disponibilidade imediata para entrevistas presenciais e funções presenciais ou híbridas no Luxemburgo.",
        photoUploadHint: "Clique para carregar a sua fotografia real do telemóvel/computador",
        changePhotoBtn: "Alterar Fotografia"
      },
      overview: {
        title: "Resumo Executivo da Candidata",
        subtitle: "Estruturado para recrutadores e diretores de equipas de TI no Luxemburgo e a nível internacional.",
        motivationBtn: "Carta de Motivação",
        structuredCvBtn: "CV Estruturado",
        summary: "Finalista da Licenciatura em Engenharia Informática na Universidade Aberta (conclusão da universidade em Janeiro de 2027) e formação técnica de base em Sistemas e Tecnologias de Computadores. Experiência prática consolidada através de estágios e funções em contexto empresarial no Luxemburgo na S.A. ITX e na Tetrao. Procuro oportunidades júnior ou de trainee em Cibersegurança, SOC, IA, Dados e Suporte de TI, com elevado rigor analítico e empenho constante em aprender e colaborar em equipa.",
        pillar1Title: "Cibersegurança & SOC",
        pillar1Desc: "Unidades curriculares em Segurança de Redes, Sistemas Distribuídos e SO. Experiência com gestão de acessos, análise de registos e documentação de incidentes.",
        pillar2Title: "Rigor em Dados Financeiros",
        pillar2Desc: "6 meses na Tetrao Luxemburgo a validar documentação financeira sensível (fundos, obrigações). Precisão rigorosa e otimização de fluxos.",
        pillar3Title: "IA & Aprendizagem",
        pillar3Desc: "Certificada na formação 'IA e Aprendizagem' (Univ. Aberta, 2026). Prática em ferramentas de anotação de IA, avaliação de modelos e SQL.",
        pillar4Title: "Suporte de TI & Sistemas",
        pillar4Desc: "Experiência na S.A. ITX Luxemburgo no apoio a utilizadores internos, resolução de problemas de acesso e garantia de continuidade operacional.",
        targetRolesTitle: "Oportunidades & Enquadramento na Equipa",
        targetRolesSubtitle: "Explore as áreas onde o entusiasmo, rigor e formação da Martina criam impacto imediato na vossa equipa:",
        openFitAnalyzer: "Abrir Analisador de Compatibilidade",
        luxSpotlightTitle: "Experiência Prática no Luxemburgo",
        luxSpotlightSubtitle: "Percurso comprovado em empresas de referência no Grão-Ducado.",
        keyFocus: "Foco Principal:"
      },
      cv: {
        title: "Curriculum Vitae",
        subtitle: "Formato profissional europeu de Martina Morais da Silva",
        filterAll: "Todo o Histórico",
        filterLux: "Experiência no Luxemburgo",
        filterSecurity: "Segurança & Dados",
        printBtn: "Imprimir / Guardar em PDF",
        showingCount: "A apresentar",
        profileHeading: "Perfil",
        skillsHeading: "Competências Técnicas",
        experienceHeading: "Experiência Profissional",
        educationHeading: "Habilitações Académicas",
        courseworkLabel: "Unidades curriculares relevantes para Segurança de TI / Cibersegurança:",
        trainingHeading: "Formação Complementar",
        digCompHeading: "Competência Digital (DigComp)",
        languagesHeading: "Línguas",
        additionalHeading: "Informações Adicionais"
      },
      letter: {
        title: "Carta de Motivação",
        subtitle: "Candidatura formal redigida segundo os padrões executivos empresariais",
        copyBtn: "Copiar Texto",
        copiedBtn: "Copiado!",
        printBtn: "Imprimir / PDF",
        calloutTitle: "Deseja agendar uma entrevista com a Martina?",
        calloutDesc: "Resposta rápida garantida para processos de recrutamento no Luxemburgo.",
        scheduleBtn: "Solicitar Entrevista",
        dateLabel: "Dossiê de Candidatura Atualizado",
        recipient: "Exmo(a). Responsável pelo Recrutamento,",
        body: [
          "Venho por este meio manifestar o meu elevado interesse em oportunidades júnior e de trainee nas áreas de Tecnologias de Informação (TI), Cibersegurança, Inteligência Artificial e Dados, bem como em funções tecnológicas correlatas na vossa organização.",
          "Encontro-me atualmente a concluir a Licenciatura em Engenharia Informática na Universidade Aberta, com conclusão da universidade prevista para Janeiro de 2027. O meu percurso académico proporcionou-me sólidos conhecimentos em segurança de redes e sistemas, sistemas operativos, redes de computadores, bases de dados, programação, desenvolvimento de software, sistemas distribuídos e inteligência artificial.",
          "Em paralelo com os meus estudos, consolidei experiência profissional através de estágios e funções em Suporte de TI, Back Office, gestão e análise de dados, anotação e controlo de qualidade no Luxemburgo. Na S.A. ITX Luxemburgo, prestei assistência técnica a utilizadores internos, resolvi incidentes ao nível de sistemas e acessos, documentei processos e colaborei com as equipas de TI para assegurar a continuidade operacional. Na Tetrao Luxemburgo, adquiri experiência rigorosa em qualidade de dados no tratamento de documentação financeira sensível (fundos e obrigações), onde a precisão e a otimização de procedimentos foram essenciais.",
          "Tenho um interesse particular em desenvolver a minha carreira no cruzamento entre tecnologia, cibersegurança, dados e inteligência artificial. A recente formação 'IA e Aprendizagem: Compreender, Utilizar e Avaliar', concluída na Universidade Aberta em 2026, fortaleceu a minha capacidade de aplicação prática de IA em contexto corporativo.",
          "Considero-me analítica, atenta aos detalhes, adaptável e com forte vontade de aprender. Gosto de resolver desafios técnicos, lidar com dados e sistemas e expandir continuamente as minhas competências. Procuro uma oportunidade júnior onde possa aplicar os meus estágios e o meu curso superior, integrando equipas de cibersegurança (SOC), IA, dados ou suporte de sistemas.",
          "Teria enorme satisfação em contribuir para a vossa organização enquanto continuo a evoluir técnica e profissionalmente. Estou totalmente disponível para posições júnior ou de trainee.",
          "Agradeço desde já a consideração da minha candidatura e encontro-me inteiramente disponível para aprofundar o meu perfil numa entrevista."
        ],
        closing: "Com os melhores cumprimentos,"
      },
      fit: {
        badge: "Sinergia de Perfil & Oportunidades",
        title: "Como posso contribuir para a vossa equipa",
        subtitle: "Sou curiosa, atenta aos detalhes e tenho vontade de continuar a aprender. Gosto de compreender como a tecnologia funciona, analisar os problemas com cuidado e procurar soluções práticas. Gostaria de contribuir com dedicação e empenho, enquanto aprendo e evoluo com a equipa.",
        compatibility: "Correspondência de Perfil",
        interviewBtn: "Agendar uma Conversa",
        whyHireTitle: "Porque a Martina Acrescenta Valor Imediato",
        academicTitle: "Fundamentação Académica Universitária",
        academicDesc: "Unidades curriculares concluídas na Universidade Aberta:",
        practicalTitle: "Competências Práticas Aplicadas",
        practicalDesc: "Ferramentas e metodologias aplicadas em contexto empresarial e de laboratório:",
        localEligibility: "Residente em Esch-sur-Alzette, Luxemburgo · Carta de Condução B · Disponibilidade Imediata.",
        proceedBtn: "Avançar para Convite de Entrevista"
      },
      contact: {
        channelTag: "Canal Direto da Candidata",
        title: "Agendar uma Entrevista com a Martina",
        subtitle: "Disponível de imediato para vagas júnior ou programas de trainee no Luxemburgo.",
        emailLabel: "Endereço de Correio Eletrónico",
        phoneLabel: "Telefone Direto",
        locationNote: "Esch-sur-Alzette, Luxemburgo · Cidadã da União Europeia com carta de condução e disponibilidade imediata.",
        formTitle: "Enviar Pedido de Entrevista Rápido",
        nameLabel: "O Seu Nome / Função",
        namePlaceholder: "ex.: Marc Weber (Responsável de Recrutamento)",
        companyLabel: "Empresa / Organização",
        companyPlaceholder: "ex.: Empresa de TI / Instituição Financeira no Luxemburgo",
        roleLabel: "Função Proposta",
        rolePlaceholder: "ex.: Analista Júnior de SOC / Suporte de TI",
        noteLabel: "Mensagem ou Datas Propostas",
        notePlaceholder: "Gostaríamos de agendar uma reunião de apresentação de 30 minutos...",
        openEmailClient: "Abrir no Vosso Cliente de Email",
        recordRequest: "Registar Pedido Aqui",
        successTitle: "Pedido de Entrevista Registado",
        successDesc: "Obrigada pelo interesse! Pode também contactar a Martina diretamente por telefone ou correio eletrónico.",
        sendViaEmailBtn: "Enviar por Correio Eletrónico"
      },
      footer: {
        tagline: "Dossiê Profissional de Candidatura",
        copyright: "Todos os direitos reservados."
      }
    }
};
