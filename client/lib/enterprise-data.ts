// Athleia.ai — Enterprise Business Data & Content System

export interface ProductService {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  description: string;
  businessImpact: string;
  features: string[];
  metrics: { value: string; label: string }[];
  iconName: string;
}

export const ENTERPRISE_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/#products" },
  { label: "Solutions", href: "/#solutions" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export const CORPORATE_INFO = {
  companyName: "Athleia AI Technologies Private Limited",
  brandName: "Athleia.ai",
  tagline: "Enterprise Industrial Knowledge Intelligence Platform",
  headquarters: {
    title: "Corporate Headquarters (Gurugram)",
    address: "DLF Cyber City, Building 10, Tower B, 12th Floor",
    city: "Gurugram, Haryana 122002",
    country: "India",
  },
  techHub: {
    title: "Global Technology & Innovation Center (Bengaluru)",
    address: "Outer Ring Road, Embassy Tech Village, Block B",
    city: "Bengaluru, Karnataka 560103",
    country: "India",
  },
  mumbaiOffice: {
    title: "Western India Operations (Mumbai)",
    address: "Bandra Kurla Complex (BKC), Maker Maxity, 5th Floor",
    city: "Mumbai, Maharashtra 400051",
    country: "India",
  },
  phone: "+91 (124) 490-8800",
  tollFree: "1800-267-8890 (India Toll-Free)",
  email: {
    general: "contact@athleia.ai",
    enterprise: "enterprise@athleia.ai",
    support: "support@athleia.ai",
    security: "security@athleia.ai",
  },
};

export const PRODUCT_SERVICES: ProductService[] = [
  {
    id: "workforce-copilot",
    slug: "workforce-copilot",
    name: "Workforce Copilot",
    tagline: "Stateful AI Assistant for Plant Operations",
    category: "AI Operations Copilot",
    description: "An enterprise-grade workforce copilot that empowers engineers, technicians, and managers to query complex plant manuals, P&ID drawings, and operational SOPs using natural language.",
    businessImpact: "Reduces Mean Time to Repair (MTTR) by up to 45% and eliminates operational downtime caused by manual SOP search.",
    features: [
      "Multi-model task routing (Groq, Claude 3.5, Gemini, Ollama)",
      "Role-adapted explanations (Technician, Engineer, Manager)",
      "Step-level SOP citation provenance",
      "3-Layer enterprise memory architecture",
    ],
    metrics: [
      { value: "45%", label: "Faster Emergency Troubleshooting" },
      { value: "100%", label: "Traceable Citation Provenance" },
    ],
    iconName: "Bot",
  },
  {
    id: "compliance-intelligence",
    slug: "compliance-intelligence",
    name: "Compliance Intelligence Core",
    tagline: "Autonomous ISO 45001 & OSHA Safety Governance",
    category: "Safety & Governance",
    description: "Automated compliance scanner that continuously audits operational procedures against ISO 45001, OSHA 1910, ASME, and API 570 regulatory standards.",
    businessImpact: "Prevents regulatory penalties and reduces non-compliance risk scores across all industrial facilities.",
    features: [
      "Automated ISO 45001 & OSHA safety rule auditing",
      "Real-time non-compliance risk scoring",
      "Corrective action mitigation checklists",
      "Deterministic audit trail export for inspectors",
    ],
    metrics: [
      { value: "100%", label: "Automated Safety Rule Coverage" },
      { value: "0", label: "Uncited Compliance Gap" },
    ],
    iconName: "ShieldCheck",
  },
  {
    id: "maintenance-intelligence",
    slug: "maintenance-intelligence",
    name: "Maintenance Telemetry Engine",
    tagline: "Predictive Equipment Analytics & MTBF Ledger",
    category: "Predictive Maintenance",
    description: "Cross-references live vibration telemetry, temperature sensors, and historical CMMS work orders to forecast equipment failure before breakdown.",
    businessImpact: "Extends machinery lifespan and converts unscheduled downtime into planned, cost-effective maintenance.",
    features: [
      "Real-time vibration anomaly detection",
      "Component MTBF failure ledger tracking",
      "CMMS work order correlation with P&ID tags",
      "Predictive health scoring for critical pumps & compressors",
    ],
    metrics: [
      { value: "3.8x", label: "Return on Asset Investment" },
      { value: "-60%", label: "Unplanned Asset Outages" },
    ],
    iconName: "Wrench",
  },
  {
    id: "ingestion-pipeline",
    slug: "ingestion-pipeline",
    name: "Document Ingestion Engine",
    tagline: "Multi-Format Industrial CAD & PDF Parser",
    category: "Document Parsing",
    description: "High-throughput ingestion pipeline designed for P&ID schematics, scanned legacy drawings, engineering specification sheets, and CAD exports.",
    businessImpact: "Digitizes decades of legacy paper and PDF drawings into searchable, high-resolution vector knowledge.",
    features: [
      "Industrial OCR for noisy scanned drawings",
      "P&ID instrument tag extraction (PT-101, P-101A)",
      "Structured table parsing & overlapping chunking",
      "SHA-256 document hashing for tamper-proof storage",
    ],
    metrics: [
      { value: "50,000+", label: "Pages Ingested per Hour" },
      { value: "99.8%", label: "OCR Tag Accuracy" },
    ],
    iconName: "Layers",
  },
  {
    id: "hybrid-retrieval",
    slug: "hybrid-retrieval",
    name: "Hybrid Search & Retrieval",
    tagline: "BM25 + Vector Reciprocal Rank Fusion",
    category: "Knowledge Search",
    description: "Combines exact keyword BM25 tag matching with 384-dimensional dense vector embeddings using Reciprocal Rank Fusion.",
    businessImpact: "Delivers sub-250ms query responses with 99.94% precision, ensuring field engineers find exact P&ID lines instantly.",
    features: [
      "Parallel BM25 keyword & dense vector search",
      "Exact equipment tag score boosting",
      "Reciprocal Rank Fusion (RRF) result ranking",
      "Sub-250ms P95 query performance",
    ],
    metrics: [
      { value: "<250ms", label: "Median Query Response Time" },
      { value: "99.94%", label: "Retrieval Precision" },
    ],
    iconName: "Search",
  },
  {
    id: "grounded-reasoning",
    slug: "grounded-reasoning",
    name: "Grounded Reasoning Engine",
    tagline: "Zero-Fabrication Evidence Dispatcher",
    category: "AI Reasoning Core",
    description: "Multi-pass dispatcher evaluating document hierarchy, checking evidence grounding, and guaranteeing that AI responses cite verified sources.",
    businessImpact: "Guarantees zero-fabrication operation in safety-critical manufacturing and oil & gas refining environments.",
    features: [
      "Strict evidence grounding evaluation",
      "Automatic fallback when evidence is insufficient",
      "Step-by-step citation link generation",
      "Immutable query audit telemetry",
    ],
    metrics: [
      { value: "0.00%", label: "Fabrication / Hallucination Rate" },
      { value: "100%", label: "Audit Telemetry Recorded" },
    ],
    iconName: "Cpu",
  },
];

export const PRICING_TIERS = [
  {
    id: "starter",
    name: "Plant Growth",
    badge: "Single Facility",
    priceMonthly: 2499,
    priceAnnual: 1999,
    description: "Ideal for single industrial facilities seeking AI-powered SOP retrieval and basic workforce copilot support.",
    features: [
      "Up to 5,000 Ingested SOPs & P&ID Drawings",
      "Workforce Copilot Access (Up to 50 Users)",
      "Hybrid BM25 + Vector Search Engine",
      "Basic ISO 45001 Compliance Auditing",
      "Standard Email & Web Support (1 Business Day SLA)",
      "Cloud Shared Storage with Encrypted Keys",
    ],
    ctaText: "Start Facility Trial",
    popular: false,
  },
  {
    id: "enterprise",
    name: "Enterprise Operations",
    badge: "Most Popular",
    priceMonthly: 6999,
    priceAnnual: 5599,
    description: "Comprehensive AI intelligence for multi-plant enterprises requiring predictive maintenance, custom LLM routing, and strict RBAC.",
    features: [
      "Unlimited SOP & P&ID Engineering Document Ingestion",
      "Workforce Copilot Access (Unlimited Enterprise Users)",
      "Full Compliance Intelligence (ISO 45001, OSHA, ASME, API 570)",
      "Predictive Maintenance Vibration Telemetry & MTBF Engine",
      "Task-Based Multi-LLM Router (Groq, Claude, Gemini, DeepSeek)",
      "Fine-Grained Role-Based Access Control (SUPER_ADMIN, MANAGER)",
      "Priority 4-Hour Response SLA & Dedicated Account Manager",
    ],
    ctaText: "Deploy Enterprise Platform",
    popular: true,
  },
  {
    id: "custom-vpc",
    name: "Custom Defense & Air-Gap",
    badge: "On-Premise / VPC",
    priceMonthly: "Custom",
    priceAnnual: "Custom",
    description: "For defense contractors, nuclear power, and heavy refineries requiring 100% air-gapped local plant cluster deployment.",
    features: [
      "100% On-Premise Local Plant Server / Private VPC Deployment",
      "Zero External Internet Connection Required (Air-Gapped)",
      "Local LLM Execution (Ollama Llama 3.1 & DeepSeek Offline)",
      "Dedicated On-Site Engineering Setup & Integration",
      "15-Minute Emergency SLA & 24/7 Telephone Response",
      "Custom Data Residency & Audit Compliance Guarantee",
    ],
    ctaText: "Request VPC Architecture Quote",
    popular: false,
  },
];

export const WHY_ATHLEIA_PILLARS = [
  {
    title: "Operational Efficiency & MTTR Reduction",
    subtitle: "Cut emergency downtime by 45%",
    description: "Eliminate hours spent manually hunting through thousand-page P&ID binders and SOP manuals during plant outages. Field technicians query equipment tags and get instant, step-by-step startup or isolation procedures.",
    iconName: "Zap",
  },
  {
    title: "Automated Safety & Regulatory Governance",
    subtitle: "Continuous ISO 45001 & OSHA auditing",
    description: "Stay audit-ready 365 days a year. Athleia's compliance intelligence automatically scans operating procedures against safety rules, generating risk scores and mitigation checklists before inspectors arrive.",
    iconName: "ShieldCheck",
  },
  {
    title: "Zero-Fabrication Grounded Intelligence",
    subtitle: "100% citation provenance guaranteed",
    description: "In industrial engineering, an incorrect answer causes costly equipment damage or safety hazards. Athleia enforces a hard zero-fabrication policy: if evidence isn't found in your documents, it says so.",
    iconName: "CheckCircle2",
  },
  {
    title: "Air-Gapped & Bank-Grade VPC Security",
    subtitle: "Your data never leaves your infrastructure",
    description: "Built for defense, nuclear, oil & gas, and power utilities. Deploy Athleia inside your AWS/Azure VPC or local plant server cluster with customer KMS keys, Argon2id encryption, and full audit logs.",
    iconName: "Lock",
  },
];
