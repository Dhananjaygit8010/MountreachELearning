/**
 * DUMMY DATA FOR TESTING & PROTOTYPING
 * -------------------------------------------------------------
 * This file contains temporary test data for courses and internships.
 * IMPORTANT: You can safely edit or delete this file at ANY TIME in realtime.
 * The system is 100% dynamic and continues running smoothly with real MongoDB Atlas data.
 */

const dummyCourses = [
  {
    title: '[DEMO] Cloud Native DevOps with Docker & Kubernetes',
    description: 'Master CI/CD automated deployment pipelines, Docker containerization, Kubernetes cluster orchestration, and Helm charts for enterprise cloud systems.',
    category: 'Cloud & DevOps',
    price: 5499,
    duration: '10 Weeks',
    level: 'Intermediate',
    instructor: 'Sameer Kulkarni, Senior Cloud Architect',
    syllabus: [
      'Containerization Fundamentals: Docker Images, Dockerfile, Compose',
      'Kubernetes Architecture: Pods, Services, Deployments, ReplicaSets',
      'Ingress Controllers, Networking, and Persistent Storage Volumes',
      'CI/CD Workflows: GitHub Actions, Jenkins, and GitOps with ArgoCD',
      'Cloud Monitoring: Prometheus & Grafana Metric Dashboards',
    ],
    projects: [
      'High-Availability Microservices Deployment on AWS EKS',
      'Zero-Downtime Blue-Green Automated Deployment Pipeline',
      'Production Log Aggregation System with Grafana Loki',
    ],
    certificationDetails: 'ISO 9001:2015 Accredited Cloud Architect Certification. Verified credential with live digital verification ID.',
    image: 'devops',
    isDummy: true,
  },
  {
    title: '[DEMO] Next.js 14 Enterprise Fullstack Architecture',
    description: 'Build lightning-fast web applications using Next.js App Router, Server Actions, TypeScript, Tailwind CSS, Prisma ORM, and Stripe Checkout.',
    category: 'Web Development',
    price: 4799,
    duration: '8 Weeks',
    level: 'Advanced',
    instructor: 'Rohan Deshpande, Lead Frontend Engineer',
    syllabus: [
      'Next.js 14 App Router: Server vs Client Components, Streaming SSR',
      'Server Actions & Data Mutations: Optimistic UI Updates and Revalidation',
      'Database Modeling with Prisma & PostgreSQL',
      'Authentication: NextAuth.js, JWT, and Role-Based Access Controls',
      'Payment Gateway Integration: Stripe Checkout & Webhook Handling',
    ],
    projects: [
      'Production SaaS Subscription Platform with Stripe',
      'Collaborative Real-Time Whiteboard with LiveBlocks',
      'Fullstack Headless E-Commerce Storefront',
    ],
    certificationDetails: 'Mountreach Verified Next.js Expert Credential. Industry recognized stamp of excellence.',
    image: 'nextjs',
    isDummy: true,
  },
  {
    title: '[DEMO] Generative AI & LLM Application Engineering',
    description: 'Build enterprise AI agents and Retrieval-Augmented Generation (RAG) systems using LangChain, OpenAI APIs, Vector Databases, and LlamaIndex.',
    category: 'Data Science & AI',
    price: 5999,
    duration: '8 Weeks',
    level: 'Advanced',
    instructor: 'Dr. Neha Kapoor, AI Research Scientist',
    syllabus: [
      'LLM Foundations: Prompt Engineering, Few-shot Learning, Tokens',
      'Vector Databases: Pinecone, ChromaDB, and Vector Embeddings',
      'Building Production RAG Systems with LangChain & LlamaIndex',
      'Autonomous Multi-Agent Systems with LangGraph',
      'Evaluation & Guardrails: TruLens, Ragas, and LLM Security',
    ],
    projects: [
      'Enterprise Document Intelligence RAG Assistant',
      'Autonomous Multi-Agent Market Research Bot',
      'Voice-Enabled AI Support Agent with Real-Time Audio',
    ],
    certificationDetails: 'ISO Certified GenAI Specialist Verification. Co-certified by leading tech research labs.',
    image: 'genai',
    isDummy: true,
  },
];

const dummyInternships = [
  {
    title: '[DEMO] Cloud Infrastructure & DevOps Intern',
    description: 'Assist in configuring Terraform modules, monitoring Kubernetes deployments, and maintaining microservice observability across multi-cloud environments.',
    duration: '6 Months',
    stipend: '₹10,000 - ₹15,000 / Month',
    skillsRequired: ['Docker', 'Linux CLI', 'Kubernetes Basics', 'GitHub Actions', 'AWS/GCP'],
    projects: ['Automated Staging Environment Spawner', 'Cloud Resource Cost Optimization Audit'],
    company: 'Mountreach Solution Private Limited',
    isoCertified: true,
    isDummy: true,
  },
  {
    title: '[DEMO] UI/UX & Product Design Intern',
    description: 'Design wireframes, high-fidelity prototypes, and design systems for enterprise web applications using Figma and conduct student usability studies.',
    duration: '3 Months',
    stipend: '₹6,000 - ₹9,000 / Month',
    skillsRequired: ['Figma', 'UI Prototyping', 'Design Systems', 'User Research', 'Wireframing'],
    projects: ['Mountreach Student Portal Redesign', 'Mobile App Micro-interaction Library'],
    company: 'Mountreach Solution Private Limited',
    isoCertified: true,
    isDummy: true,
  },
];

module.exports = {
  dummyCourses,
  dummyInternships,
};
