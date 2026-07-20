"use client";

export interface CorpusDocument {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  contentSnippet?: string;
  fileUrl?: string;
  chunks: Array<{
    id: string;
    text: string;
    section: string;
    page: number;
    score: number;
  }>;
}

const DEFAULT_DOCUMENTS: CorpusDocument[] = [
  {
    id: "doc_sys_design_01",
    name: "System_Architecture_&_Design_Specification.pdf",
    size: "1.85 MB",
    type: "Engineering Spec",
    uploadedAt: "10:15 AM",
    contentSnippet: "System Design for Enterprise Distributed Architecture and API Gateway routing.",
    chunks: [
      {
        id: "chk_sys_01",
        text: "System Design Overview: Athleia is structured around microservices including Ingestion (8003), Retrieval (8001), Grounded Reasoning (8002), and an Enterprise API Gateway (8000). All internal traffic passes through the Gateway for rate limiting, circuit breaking, and trace propagation.",
        section: "1.0 Architecture & Gateway Topology",
        page: 1,
        score: 0.96,
      },
      {
        id: "chk_sys_02",
        text: "High Availability & Fault Tolerance: The Gateway implements a 3-state Circuit Breaker (CLOSED, OPEN, HALF-OPEN) and exponential backoff retry policies for idempotent GET requests to guarantee zero system design single points of failure.",
        section: "2.3 Fault Tolerance & Circuit Breaker",
        page: 4,
        score: 0.91,
      },
      {
        id: "chk_sys_03",
        text: "Hybrid Vector & BM25 Search Design: The retrieval engine pairs 384-dimensional dense embeddings with rank-bm25 exact keyword matching, applying Reciprocal Rank Fusion (RRF) to rank passages.",
        section: "3.1 Hybrid Search Pipeline",
        page: 7,
        score: 0.88,
      },
    ],
  },
  {
    id: "doc_pid_4012",
    name: "PND-4012_PUMP_STATION_PID.pdf",
    size: "3.20 MB",
    type: "P&ID Diagram",
    uploadedAt: "09:30 AM",
    contentSnippet: "Cooling Water Station 101 P&ID schematic showing Pump P-101A and PT-101.",
    chunks: [
      {
        id: "chk_pid_01",
        text: "Centrifugal Pump P-101A is monitored by Pressure Transmitter PT-101 in Cooling Water Station 101. Standard operating suction pressure is 150 PSI.",
        section: "Title Block > Equipment Overview",
        page: 1,
        score: 0.95,
      },
      {
        id: "chk_pid_02",
        text: "Emergency Valve VLV-302 controls the isolation boundary on process line 6\"-CW-101-CS150 in Cooling Water Station 101.",
        section: "Isolation Boundary Diagram",
        page: 1,
        score: 0.92,
      },
    ],
  },
];

const STORAGE_KEY = "athleia_corpus_documents";

export function getCorpusDocuments(): CorpusDocument[] {
  if (typeof window === "undefined") return DEFAULT_DOCUMENTS;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DOCUMENTS));
      return DEFAULT_DOCUMENTS;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_DOCUMENTS;
  }
}

export function saveCorpusDocuments(docs: CorpusDocument[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.getItem(STORAGE_KEY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  } catch (err) {
    console.error("Failed to save documents to localStorage", err);
  }
}

export function addCorpusDocument(file: File): CorpusDocument {
  const ext = file.name.split(".").pop()?.toUpperCase() || "DOC";
  let docType = "SOP Procedure";
  if (file.name.toLowerCase().includes("pid") || file.name.toLowerCase().includes("p&id")) {
    docType = "P&ID Diagram";
  } else if (file.name.toLowerCase().includes("system") || file.name.toLowerCase().includes("design") || ["PDF", "CAD", "DWG"].includes(ext)) {
    docType = "Engineering Spec";
  }

  const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");

  let fileUrl: string | undefined = undefined;
  if (typeof window !== "undefined") {
    try {
      fileUrl = URL.createObjectURL(file);
    } catch {
      // ignore
    }
  }

  const newDoc: CorpusDocument = {
    id: `doc_${Date.now()}`,
    name: file.name,
    size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
    type: docType,
    uploadedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    contentSnippet: `Ingested document: ${baseName}`,
    fileUrl,
    chunks: [
      {
        id: `chk_${Date.now()}_1`,
        text: `Extracted passage from ${file.name}: ${baseName} system design specification and technical parameters. Conforms to industrial intelligence schema.`,
        section: "Section 1.0 System Architecture Overview",
        page: 1,
        score: 0.94,
      },
      {
        id: `chk_${Date.now()}_2`,
        text: `Operating requirements and operational constraints for ${baseName}. Includes interface definitions, Gateway routing specs, and memory allocation parameters.`,
        section: "Section 2.2 Functional Specifications",
        page: 2,
        score: 0.89,
      },
      {
        id: `chk_${Date.now()}_3`,
        text: `Security, compliance, and verification policies for ${baseName}. Enforces zero-trust airgap boundary and cryptographic checksum verification.`,
        section: "Section 3.5 Security & Audit Policy",
        page: 3,
        score: 0.85,
      },
    ],
  };

  const existing = getCorpusDocuments();
  const updated = [newDoc, ...existing];
  saveCorpusDocuments(updated);
  return newDoc;
}
