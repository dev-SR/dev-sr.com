/** Site-facing subset of master_resume.md — do not invent metrics. */

export const profile = {
  name: 'Sharukh Rahman',
  roleLine: 'Data Science · Software Engineering',
  location: 'Budapest, Hungary',
  email: 'sharukhraman@gmail.com',
  github: 'https://github.com/dev-SR',
  githubLabel: 'github.com/dev-SR',
  linkedin: 'https://www.linkedin.com/in/sharukh-rahman/',
  linkedinLabel: 'linkedin.com/in/sharukh-rahman',
  headline: 'Data science student. Software engineer',
  bio: 'MSc Data Science at Óbuda University. Previously a .NET software engineer at Encoders, building ERP, trade, and hospital systems. Open to ML, data science, and software roles. Exploring embodied AI, continual learning, and multimodal AI. Projects, notes, and experiments live here.',
  availability: 'Open to ML / SWE roles',
  focus: ['Python', 'ML', 'TypeScript'] as const,
} as const;

export const education = [
  {
    institution: 'Óbuda University',
    place: 'Budapest, Hungary',
    degree: 'MSc in Data Science',
    period: 'Sep 2025 – Jun 2027 (expected)',
    detail: 'CWA 4.56 / 5.00 · Stipendium Hungaricum Scholarship',
  },
  {
    institution: 'Green University of Bangladesh',
    place: 'Dhaka, Bangladesh',
    degree: 'BSc in Computer Science and Engineering',
    period: 'Jan 2019 – May 2023',
    detail: 'CGPA 3.93 / 4.00 · Vice-Chancellor’s & Dean’s Honor',
  },
] as const;

export const experience = [
  {
    company: 'Encoders Info Tech Ltd.',
    place: 'Dhaka, Bangladesh',
    title: 'Software Engineer (.NET)',
    period: 'Oct 2023 – Sep 2025',
    note: 'Promoted from Intern (Jul 2023 – Sep 2023)',
    bullets: [
      'Owned Finance, Inventory & Sales modules on VitalityCash ERP (bank reconciliation, invoice payments, GL master, stock-out, VAT) with C#, ASP.NET Core MVC, and SQL Server.',
      'Shipped Clarichem loan lifecycle (requisition, stock-validated loan in/out/return, ledgers) plus Excel/PDF exports with EF Core, EPPlus, and iTextSharp.',
      'Built HMS patient ADT workflows, clinical CRUDs, and pharmacy/medicine modules integrated into prescription flows.',
      'Applied onion architecture, unit-of-work, repository–service, and specification patterns with unit tests and stored-procedure optimization.',
    ],
  },
] as const;

export type ProfileProject = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  featured: boolean;
  href: string;
};

export const projects: ProfileProject[] = [
  {
    id: 'rkgm',
    title: 'RKGM — LLM-Powered Knowledge-Gap Mitigation',
    shortTitle: 'RKGM',
    description:
      'Two-phase NLP pipeline that detects prerequisite gaps in research papers via self-consistency prompting, then builds a chronologically ordered learning document from the citation graph — hybrid retrieval (dense + BM25 + RRF + reranking) with a RAGAS faithfulness gate.',
    technologies: ['RAG', 'LLM', 'NLP', 'sentence-transformers', 'RAGAS'],
    githubUrl: 'https://github.com/dev-SR/RKGM',
    featured: true,
    href: 'https://github.com/dev-SR/RKGM',
  },
  {
    id: 'citi-bike',
    title: 'Citi Bike — Demand Forecasting & Station Prioritization',
    shortTitle: 'Citi Bike',
    description:
      'End-to-end ML pipeline for Jersey City Citi Bike: short-term station demand forecasting, imbalance-risk classification, and interpretable station-priority ranking with leakage-safe time-series features and weather signals.',
    technologies: ['Time series', 'scikit-learn', 'pandas', 'Feature engineering'],
    githubUrl: 'https://github.com/dev-SR/citybike',
    featured: true,
    href: 'https://github.com/dev-SR/citybike',
  },
  {
    id: 'code-runner',
    title: 'Code.Runner — Online Code-Execution Platform',
    shortTitle: 'Code.Runner',
    description:
      'Full-stack NestJS + React platform that executes C, C++, Python, JavaScript, and TypeScript through an asynchronous job pipeline with persistent status tracking and isolated child-process execution.',
    technologies: ['NestJS', 'React', 'Async jobs', 'Node.js'],
    githubUrl: 'https://github.com/dev-SR/online-compiler-using-react-nestjs',
    featured: false,
    href: 'https://github.com/dev-SR/online-compiler-using-react-nestjs',
  },
];

export const skillGroups = [
  {
    category: 'Programming',
    technologies: ['Python', 'TypeScript / JavaScript', 'C#', 'SQL'],
  },
  {
    category: 'ML / Data',
    technologies: [
      'PyTorch',
      'scikit-learn',
      'XGBoost / LightGBM',
      'pandas / NumPy',
      'Optuna',
      'RAG / NLP',
    ],
  },
  {
    category: 'Web / Backend',
    technologies: [
      'ASP.NET Core',
      'FastAPI',
      'NestJS',
      'React / Next.js',
      'PostgreSQL',
      'MS SQL Server',
    ],
  },
  {
    category: 'MLOps / DevOps',
    technologies: ['MLflow', 'Docker', 'Kubernetes', 'Airflow', 'GitHub Actions', 'Terraform'],
  },
] as const;

export const publications = [
  {
    title:
      'An Article Recommendation Technique from a Multi-Layer Reference Article Graph for Facilitating Chronological Learning',
    venue: 'IEEE STI 2022',
    href: 'https://doi.org/10.1109/sti56238.2022.10103286',
  },
  {
    title:
      'A Novel Hybrid Deep Neural Network for Early Detection and Classification of Chicken Diseases',
    venue: 'IEEE STI 2023',
    href: 'https://doi.org/10.1109/STI59863.2023.10464991',
  },
] as const;

export const certifications = [
  {
    title: 'Machine Learning Specialization',
    issuer: 'Coursera (DeepLearning.AI / Stanford)',
    href: 'https://www.coursera.org/account/accomplishments/specialization/certificate/X7GMSU3KG8HL',
  },
] as const;

export const homeStrengths = [
  'Applied ML systems',
  'Backend (.NET / Node)',
  'RAG & NLP',
  'Data pipelines',
] as const;
