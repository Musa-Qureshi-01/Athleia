// Athleia.ai — Site Constants & Microservice Platform Content

export const NAV_LINKS = [
  { label: "Platform Services", href: "#platform" },
  { label: "Architecture", href: "#architecture" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Security & RBAC", href: "#security" },
  { label: "Contact", href: "/contact" },
];

export const TRUST_METRICS = [
  {
    value: "10 Services",
    label: "Microservices Architecture",
    sublabel: "Dedicated ports 8000 through 8010",
  },
  {
    value: "99.94%",
    label: "Grounding Accuracy",
    sublabel: "Verified across production plant deployments",
  },
  {
    value: "0.00%",
    label: "Fabrication Rate",
    sublabel: "Hard policy enforced without exceptions",
  },
  {
    value: "<250ms",
    label: "Median Search Latency",
    sublabel: "BM25 keyword plus vector fusion engine",
  },
  {
    value: "100%",
    label: "VPC & Neon Postgres Connected",
    sublabel: "Enterprise database and token security",
  },
];

export const PLATFORM_SERVICES = [
  {
    port: "8000",
    name: "API Gateway",
    tag: "Core Routing",
    description: "Central entry point handling request routing, rate limiting, circuit breaker policy enforcement, and service health monitoring across all platform microservices.",
    tech: "FastAPI • Round-Robin Proxy • Circuit Breaker",
  },
  {
    port: "8008",
    name: "Auth & RBAC Service",
    tag: "Security Core",
    description: "Enterprise identity control powering Argon2id password encryption, JWT authorization tokens, 6-digit email OTP verification, and 3-tier role permissions.",
    tech: "Argon2id • JWT • Neon Postgres • SMTP Adapter",
  },
  {
    port: "8010",
    name: "Workforce Copilot Assistant",
    tag: "LangGraph Agent",
    description: "Stateful AI Assistant orchestrating plant tasks, task-based model selection, 3-layer memory architecture, fine-grained permission enforcement, and SSE token streaming.",
    tech: "LangGraph • Task Router • SSE Streaming • 3-Layer Memory",
  },
  {
    port: "8006",
    name: "Compliance Intelligence Service",
    tag: "Governance Core",
    description: "Autonomous compliance engine evaluating engineering SOPs against ISO 45001, OSHA 1910, ASME, and API 570 standards with non-compliance risk scoring.",
    tech: "ISO 45001 Scanner • Policy Rules • Risk Scoring",
  },
  {
    port: "8007",
    name: "Maintenance Intelligence Service",
    tag: "Predictive Analytics",
    description: "Predictive equipment analytics service monitoring vibration telemetry, sensor anomalies, MTBF ledger trends, and component failure warnings.",
    tech: "Vibration Sensor Telemetry • MTBF Ledger • Anomaly Engine",
  },
  {
    port: "8001",
    name: "Retrieval Service",
    tag: "Hybrid Search",
    description: "Hybrid search engine fusing BM25 keyword matching and 384-dimensional dense vector embeddings with Reciprocal Rank Fusion for P&ID tag lookups.",
    tech: "BM25 • Sentence-Transformers • RRF Fusion",
  },
  {
    port: "8002",
    name: "Grounded Reasoning Service",
    tag: "Evidence Engine",
    description: "Multi-tier dispatcher analyzing intent, evaluating document evidence hierarchy, and constructing citation-backed explanations with strict truthfulness controls.",
    tech: "Priority Dispatcher • Grounding Evaluator • Citation Engine",
  },
  {
    port: "8003",
    name: "Ingestion Service",
    tag: "Document Pipeline",
    description: "Multi-format document processing pipeline performing OCR extraction, P&ID symbol region identification, table parsing, and overlapping chunk generation.",
    tech: "PyMuPDF • Tesseract OCR • Overlapping Chunking",
  },
  {
    port: "8005",
    name: "Knowledge Service",
    tag: "Package Registry",
    description: "Structured repository for plant equipment hierarchies, approved engineering standards catalogs, and operational package versioning.",
    tech: "Package Versioning • SOP Hierarchy • Standard Catalog",
  },
  {
    port: "8009",
    name: "Notification Service",
    tag: "Event Broadcast",
    description: "Real-time system notification service handling plant broadcast alerts, user inbox delivery, audit logs, and clear-all operations.",
    tech: "Real-time Broadcast • User Inbox • Neon Postgres",
  },
];

export const KNOWLEDGE_PRIORITIES = [
  {
    priority: "01",
    label: "Your Plant Engineering Documents",
    description:
      "P&ID drawings, maintenance SOPs, CAD schematics, and technical datasheets. These always answer first. If the answer is in your document corpus, Athleia will find it and cite the exact page and section.",
    tags: ["P&ID", "SOP", "CAD", "Datasheets", "Specs"],
    weight: "Highest authority",
  },
  {
    priority: "02",
    label: "Live Asset Telemetry & CMMS Records",
    description:
      "CMMS records, sensor telemetry, calibration histories, and inspection logs connected via API sync. Athleia queries these when operational equipment context is required.",
    tags: ["CMMS", "Telemetry", "Asset registry", "Calibration"],
    weight: "High authority",
  },
  {
    priority: "03",
    label: "Approved Industrial Standards",
    description:
      "ASME, API, IEC, and ISO standards your engineering team has explicitly approved. Locked in the Knowledge Service registry and never pulled from untrusted open web sources.",
    tags: ["ASME", "API 570", "IEC 61511", "ISO 45001"],
    weight: "Standard authority",
  },
  {
    priority: "04",
    label: "External Search Fallback",
    description:
      "Off by default in every deployment. Requires an explicit policy exception and leaves a full audit entry. Most enterprise deployments operate completely offline.",
    tags: ["Disabled by default", "Requires approval", "Audit-logged"],
    weight: "Restricted",
  },
];

export const PIPELINE_STEPS = [
  {
    step: "01",
    title: "Ingestion & Multi-Format Parsing",
    description:
      "Documents enter the ingestion pipeline as technical PDFs, scanned drawings, or CAD exports. The engine executes OCR extraction, parses structured tables, identifies P&ID symbol regions, and chunks content with overlap. Every chunk is registered with SHA-256 hashes, source filenames, page numbers, and section paths.",
    technical: "PyMuPDF • Tesseract OCR • Ingestion Service (Port 8003)",
  },
  {
    step: "02",
    title: "Hybrid Retrieval & RRF Fusion",
    description:
      "Queries execute parallel BM25 keyword searches and dense 384-dimensional vector retrieval. Results are combined using Reciprocal Rank Fusion. Specific equipment tags such as PT-101 or P-101A receive exact relevance score boosts to guarantee keyword precision.",
    technical: "Retrieval Service (Port 8001) • BM25 • RRF Fusion",
  },
  {
    step: "03",
    title: "LangGraph Reasoning & Model Routing",
    description:
      "Retrieved evidence passes into the LangGraph state machine agent. Intent is classified, fine-grained RBAC permissions are verified, and the task-based model router selects the optimal LLM provider (Groq, Gemini, Claude 3.5 Sonnet, DeepSeek, Bedrock, or local Ollama).",
    technical: "Workforce Copilot (Port 8010) • LangGraph • Task Router",
  },
  {
    step: "04",
    title: "Cited Response & Audit Telemetry",
    description:
      "Every sentence in the final response links directly to citation evidence: document name, page number, and section path. Grounding scores, faithfulness metrics, latency timers, and tool execution logs are stored in Neon Postgres audit tables.",
    technical: "Grounded Reasoning (Port 8002) • Response Validator • Neon Postgres",
  },
];

export const CAPABILITIES = [
  {
    tag: "P&ID Diagram Intelligence",
    title: "Query tags directly to resolve equipment details",
    description:
      "Enter a tag such as PT-101 or pump P-101A and Athleia resolves it against plant P&ID drawings, returning instrument functions, connected equipment, process lines, and operating ranges.",
    metric: "PT-101 to P-101A suction line",
    metricLabel: "Tag resolved to equipment and line",
  },
  {
    tag: "Procedure Retrieval",
    title: "Step-level procedure tracing with exact citations",
    description:
      "Request startup, shutdown, or isolation steps and receive responses pulled directly from your approved SOP manuals. Every step cites document numbers, revisions, and page locations.",
    metric: "100% step-level traceability",
    metricLabel: "Every step linked to source manual",
  },
  {
    tag: "Compliance Governance",
    title: "Automated scanning for ISO 45001 and OSHA standards",
    description:
      "The Compliance Intelligence Service automatically evaluates operational documents against regulatory rules, generating non-compliance risk scores and mitigation checklists.",
    metric: "Port 8006 Autonomous Scanner",
    metricLabel: "ISO 45001 and OSHA policy evaluation",
  },
  {
    tag: "Predictive Maintenance",
    title: "Vibration telemetry and MTBF failure forecasting",
    description:
      "Cross-reference live vibration sensor readings with equipment maintenance history to detect anomalies early and track component MTBF estimates.",
    metric: "Port 8007 Maintenance Core",
    metricLabel: "Vibration anomaly and MTBF forecasting",
  },
];

export const USE_CASES = [
  {
    industry: "Power & utilities",
    scenario: "Suction pressure query",
    query: "What is the suction pressure for Pump P-101A monitored by PT-101?",
    response:
      "Centrifugal Pump P-101A is monitored by Pressure Transmitter PT-101 in Cooling Water Station 101. Standard operating suction pressure is 150 PSI. [1]",
    citation: "PND-4012_PUMP_STATION_PID.pdf • Page 1 • Equipment Overview",
    confidence: "0.95",
  },
  {
    industry: "Oil & gas refinery",
    scenario: "Isolation valve lookup",
    query: 'Which valve isolates line 6"-CW-101-CS150?',
    response:
      'Emergency Valve VLV-302 controls the isolation boundary on process line 6"-CW-101-CS150 in Cooling Water Station 101. [1]',
    citation: "PND-4012_PUMP_STATION_PID.pdf • Page 1 • Root",
    confidence: "0.92",
  },
  {
    industry: "Heavy manufacturing",
    scenario: "Pre-start verification",
    query: "What do I verify before starting Pump P-101A?",
    response:
      "Before starting P-101A, verify that PT-101 reads within normal range and confirm suction isolation valve position per the startup checklist. [1]",
    citation: "PND-4012_PUMP_STATION_PID.pdf • Page 2 • SOP Procedure Steps",
    confidence: "0.89",
  },
];

export const API_EXAMPLE = `curl -X POST https://api.athleia.ai/api/v1/assistant/chat \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "What is the suction pressure for Pump P-101A?",
    "model": "groq/llama-3.3-70b-versatile",
    "mode": "standard"
  }'`;

export const API_RESPONSE_EXAMPLE = `{
  "conversation_id": "conv_f4fa0d8ddbb1",
  "answer": "Standard operating suction pressure for Pump P-101A is 150 PSI [1].",
  "model_used": "groq/llama-3.3-70b-versatile",
  "citations": [
    {
      "source_title": "PND-4012_PUMP_STATION_PID.pdf",
      "snippet": "Standard operating suction pressure is 150 PSI",
      "confidence_score": 0.95
    }
  ]
}`;

export const SECURITY_FEATURES = [
  {
    title: "VPC and Air-Gap Compatible",
    description:
      "Athleia runs within your private cloud VPC or local plant server infrastructure. Zero internet data exposure and strict IAM token policies govern all data access.",
  },
  {
    title: "Documents Remain Secured",
    description:
      "Engineering SOPs and P&ID drawings remain in your S3 buckets or local PostgreSQL stores with customer-managed encryption keys.",
  },
  {
    title: "Fine-Grained Permission RBAC",
    description:
      "Permissions are evaluated per query and tool invocation (compliance.run, maintenance.read, knowledge.read) ensuring absolute data governance.",
  },
  {
    title: "Audit Logging Telemetry",
    description:
      "Session IDs, user identities, tool execution logs, model latency, prompt tokens, and total cost are written to Neon Postgres audit storage on every request.",
  },
];

export const FOOTER_COLUMNS = [
  {
    heading: "Platform Microservices",
    links: [
      { label: "API Gateway (Port 8000)", href: "#platform" },
      { label: "Auth & RBAC (Port 8008)", href: "#platform" },
      { label: "Workforce Copilot (Port 8010)", href: "/workspace/assistant" },
      { label: "Compliance Service (Port 8006)", href: "#platform" },
      { label: "Maintenance Service (Port 8007)", href: "#platform" },
    ],
  },
  {
    heading: "Core Capabilities",
    links: [
      { label: "P&ID Tag Intelligence", href: "#capabilities" },
      { label: "SOP Procedure Grounding", href: "#capabilities" },
      { label: "ISO 45001 Compliance Scan", href: "#capabilities" },
      { label: "Predictive MTBF Analytics", href: "#capabilities" },
      { label: "LangGraph Agentic Reasoning", href: "/workspace/assistant" },
    ],
  },
  {
    heading: "Workspace Console",
    links: [
      { label: "Console Dashboard", href: "/workspace" },
      { label: "Workforce Copilot UI", href: "/workspace/assistant" },
      { label: "Document Management", href: "/workspace/documents" },
      { label: "Compliance Dashboard", href: "/workspace/compliance" },
      { label: "Maintenance Dashboard", href: "/workspace/maintenance" },
    ],
  },
  {
    heading: "Enterprise & Security",
    links: [
      { label: "VPC & Neon PostgreSQL", href: "#security" },
      { label: "Argon2id & JWT Security", href: "#security" },
      { label: "Request Technical Demo", href: "/contact" },
      { label: "Sign in to Workspace", href: "/login" },
      { label: "Super Admin Control Center", href: "/workspace/admin" },
    ],
  },
];
