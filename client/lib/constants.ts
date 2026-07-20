// Athleia.ai — Site Constants & Content

export const NAV_LINKS = [
  { label: "Platform", href: "#platform" },
  { label: "Architecture", href: "#architecture" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Security", href: "#security" },
];

export const TRUST_METRICS = [
  {
    value: "99.94%",
    label: "Grounding accuracy",
    sublabel: "Measured across production deployments",
  },
  {
    value: "0.00%",
    label: "Fabrication rate",
    sublabel: "Hard policy — no answer without a source",
  },
  {
    value: "<250ms",
    label: "Median search latency",
    sublabel: "BM25 + vector fusion, P95 under 400ms",
  },
  {
    value: "100%",
    label: "Air-gap compatible",
    sublabel: "No document leaves your infrastructure",
  },
];

export const KNOWLEDGE_PRIORITIES = [
  {
    priority: "01",
    label: "Your Engineering Documents",
    description:
      "P&ID drawings, maintenance SOPs, CAD schematics, technical datasheets. These always answer first. If the answer is in your document corpus, Athleia will find it and cite the exact page.",
    tags: ["P&ID", "SOP", "CAD", "Datasheets", "Specs"],
    weight: "Highest authority",
  },
  {
    priority: "02",
    label: "Live Asset Records",
    description:
      "CMMS records, sensor telemetry, calibration histories, inspection logs. Connected via API or batch sync. Athleia queries these when equipment context matters.",
    tags: ["CMMS", "Telemetry", "Asset registry", "Calibration"],
    weight: "High authority",
  },
  {
    priority: "03",
    label: "Approved Standards",
    description:
      "ASME, API, IEC, ISO standards your engineering team has explicitly approved. Locked in the registry — not pulled from the open web.",
    tags: ["ASME", "API 570", "IEC 61511", "ISO 31010"],
    weight: "Standard authority",
  },
  {
    priority: "04",
    label: "External Search",
    description:
      "Off by default in every deployment. Requires an explicit policy exception and leaves a full audit entry. Most customers never enable it.",
    tags: ["Disabled by default", "Requires approval", "Audit-logged"],
    weight: "Restricted",
  },
];

export const PIPELINE_STEPS = [
  {
    step: "01",
    title: "Ingestion & parsing",
    description:
      "Documents come in as PDFs, scanned drawings, or CAD exports. The ingestion pipeline runs OCR, extracts tables, identifies P&ID symbol regions, and chunks everything with overlap. Each chunk is stored with its SHA-256 hash, source filename, page number, and section path.",
    technical: "PyMuPDF · Tesseract · AWS S3 · Neon PostgreSQL",
  },
  {
    step: "02",
    title: "Hybrid retrieval",
    description:
      "Every query runs BM25 keyword search and 384-dimensional dense vector search in parallel. Results are fused with Reciprocal Rank Fusion. Equipment tags like PT-101 or P-101A get an exact-match score boost — keyword relevance that pure vector search misses.",
    technical: "rank-bm25 · sentence-transformers · RRF · pgvector",
  },
  {
    step: "03",
    title: "Reasoning dispatch",
    description:
      "Retrieved chunks pass into the 4-tier priority dispatcher. Intent is classified, evidence is ranked by source authority, and a strict system prompt instructs the model to cite only what it found. If the top chunks don't answer the question, the system says so.",
    technical: "Groq · Gemini · OpenRouter · Amazon Bedrock",
  },
  {
    step: "04",
    title: "Cited output",
    description:
      "Every factual sentence in the response links to a citation: source document, page number, section path. Grounding score, faithfulness score, and overall confidence are calculated and returned alongside the answer. The full reasoning trace is written to audit storage.",
    technical: "Grounding score · Faithfulness · Citation provenance · Audit log",
  },
];

export const CAPABILITIES = [
  {
    tag: "P&ID queries",
    title: "Ask about a tag, get the document answer",
    description:
      "Type a query about PT-101 or pump P-101A and Athleia resolves it against your P&ID drawings — returning the instrument's function, connected equipment, process line, and operating range. No diagram viewer required.",
    metric: "PT-101 → P-101A suction line",
    metricLabel: "Tag resolved to equipment & line",
  },
  {
    tag: "Procedure retrieval",
    title: "Procedures with step-level citations",
    description:
      "Ask for a startup or isolation procedure and get back the steps from your actual SOP, not a generic answer. Each step cites the SOP number, revision, and page it came from.",
    metric: "100% step-level traceability",
    metricLabel: "Every step linked to its source",
  },
  {
    tag: "Asset correlation",
    title: "Cross-reference P&ID tags with CMMS records",
    description:
      "Athleia connects equipment tags in your drawings to CMMS asset IDs in your maintenance database. Ask about P-101A and get its service history, calibration status, and last inspection date in the same response.",
    metric: "AST-9901 ↔ P-101A",
    metricLabel: "CMMS record resolved from P&ID tag",
  },
  {
    tag: "Honesty policy",
    title: "No answer is better than a wrong answer",
    description:
      "When retrieved evidence doesn't support a confident answer, Athleia returns: 'Insufficient grounded evidence to answer this query.' It does not fill gaps with plausible-sounding text. Confidence scores are always visible.",
    metric: "0.00% fabrication rate",
    metricLabel: "Hard policy enforced in production",
  },
];

export const USE_CASES = [
  {
    industry: "Power & utilities",
    scenario: "Suction pressure query",
    query: "What is the suction pressure for Pump P-101A monitored by PT-101?",
    response:
      "Centrifugal Pump P-101A is monitored by Pressure Transmitter PT-101 in Cooling Water Station 101. Standard operating suction pressure is 150 PSI. [1]",
    citation: "PND-4012_PUMP_STATION_PID.pdf · Page 1 · Title Block > Equipment Overview",
    confidence: "0.95",
  },
  {
    industry: "Oil & gas refinery",
    scenario: "Isolation valve lookup",
    query: 'Which valve isolates line 6"-CW-101-CS150?',
    response:
      'Emergency Valve VLV-302 controls the isolation boundary on process line 6"-CW-101-CS150 in Cooling Water Station 101. [1]',
    citation: "PND-4012_PUMP_STATION_PID.pdf · Page 1 · Root",
    confidence: "0.92",
  },
  {
    industry: "Heavy manufacturing",
    scenario: "Pre-start verification",
    query: "What do I verify before starting Pump P-101A?",
    response:
      "Before starting P-101A, verify that PT-101 reads within normal range and confirm suction isolation valve position per the startup checklist. [1]",
    citation: "PND-4012_PUMP_STATION_PID.pdf · Page 2 · SOP Procedure Steps",
    confidence: "0.89",
  },
];

export const API_EXAMPLE = `curl -X POST https://api.athleia.ai/v1/reason \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "What is the suction pressure for Pump P-101A?",
    "allow_external_knowledge": false,
    "filters": {
      "document_types": ["PID", "SOP"],
      "priority_ceiling": 2
    }
  }'`;

export const API_RESPONSE_EXAMPLE = `{
  "status": "success",
  "data": {
    "intent_category": "ENGINEERING_PID_DIAGRAM_INQUIRY",
    "grounded_answer": "Standard operating suction pressure is 150 PSI [1].",
    "evaluation": {
      "grounding_score": 1.0,
      "faithfulness_score": 0.95,
      "overall_confidence": 0.95
    },
    "citations": [
      {
        "citation_id": "[1]",
        "source_name": "PND-4012_PUMP_STATION_PID.pdf",
        "page_number": 1,
        "section_path": "Title Block > Equipment Overview"
      }
    ]
  }
}`;

export const SECURITY_FEATURES = [
  {
    title: "Stays inside your VPC",
    description:
      "Athleia runs in your AWS or Azure account. No inbound traffic from the internet, no managed SaaS endpoints touching your document store. IAM policies govern all access.",
  },
  {
    title: "Documents don't leave",
    description:
      "Your P&IDs, SOPs, and asset records are stored in your S3 bucket with your KMS key. We never copy or cache them on our infrastructure.",
  },
  {
    title: "Tenant isolation is hard-coded",
    description:
      "Business units are separated at the database query level, not just the UI level. A query from one tenant cannot retrieve documents from another even if the vector scores would suggest it.",
  },
  {
    title: "Every query is logged",
    description:
      "Session ID, intent class, evidence chunks used, citations returned, confidence scores, and operator identity — written to immutable audit storage on every request.",
  },
];

export const FOOTER_COLUMNS = [
  {
    heading: "Platform",
    links: [
      { label: "Architecture overview", href: "#architecture" },
      { label: "Knowledge priority system", href: "#platform" },
      { label: "Grounding engine", href: "#capabilities" },
      { label: "Ingestion pipeline", href: "#platform" },
      { label: "Retrieval service", href: "#architecture" },
    ],
  },
  {
    heading: "Capabilities",
    links: [
      { label: "P&ID intelligence", href: "#capabilities" },
      { label: "SOP grounding", href: "#capabilities" },
      { label: "Asset integration", href: "#capabilities" },
      { label: "Honesty policy", href: "#capabilities" },
      { label: "Citation engine", href: "#capabilities" },
    ],
  },
  {
    heading: "Workspace",
    links: [
      { label: "Console dashboard", href: "/workspace" },
      { label: "Document management", href: "/workspace/documents" },
      { label: "Hybrid retrieval", href: "/workspace/search" },
      { label: "Reasoning engine", href: "/workspace/intelligence" },
      { label: "Platform settings", href: "/workspace/settings" },
    ],
  },
  {
    heading: "Enterprise",
    links: [
      { label: "Security whitepaper", href: "#security" },
      { label: "VPC deployment guide", href: "#security" },
      { label: "Compliance overview", href: "#security" },
      { label: "Sign in to workspace", href: "/login" },
      { label: "Request demo", href: "/contact" },
    ],
  },
];
