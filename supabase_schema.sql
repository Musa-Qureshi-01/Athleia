-- =============================================================================
-- AXIOS ENTERPRISE INTELLIGENCE — SUPABASE POSTGRESQL PRODUCTION SCHEMA
-- Project ID: gfoxarcqwjmbllodythx (Region: ap-south-1 Mumbai)
-- All tables contain clean structural schemas with ZERO sample/mock data.
-- =============================================================================

-- Enable standard cryptographic & UUID extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. DUAL AUTHENTICATION & IDENTITY SERVICE (WorkOS Dual Auth)
-- =============================================================================

-- 1.1 Organizational Enterprise Users (Permanent corporate accounts)
CREATE TABLE IF NOT EXISTS organizational_users (
    user_id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    organization VARCHAR(255) DEFAULT 'Axios Enterprise',
    role VARCHAR(32) DEFAULT 'EMPLOYEE',
    status VARCHAR(32) DEFAULT 'ACTIVE',
    is_verified BOOLEAN DEFAULT TRUE,
    failed_login_attempts INT DEFAULT 0,
    locked_until VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_org_users_email ON organizational_users (email);
CREATE INDEX IF NOT EXISTS idx_org_users_role ON organizational_users (role);
CREATE INDEX IF NOT EXISTS idx_org_users_status ON organizational_users (status);

-- 1.2 Evolution Accounts (Dedicated isolated demo sandbox sessions)
CREATE TABLE IF NOT EXISTS evolution_accounts (
    session_id VARCHAR(64) PRIMARY KEY,
    demo_email VARCHAR(255) NOT NULL,
    demo_organization VARCHAR(255) DEFAULT 'Evolution Demo Sandbox',
    role VARCHAR(32) DEFAULT 'EVOLUTION_GUEST',
    queries_used INT DEFAULT 0,
    queries_limit INT DEFAULT 50,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_evolution_demo_email ON evolution_accounts (demo_email);
CREATE INDEX IF NOT EXISTS idx_evolution_active ON evolution_accounts (is_active);

-- 1.3 Verification OTPs
CREATE TABLE IF NOT EXISTS verification_otps (
    otp_id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    email VARCHAR(255) NOT NULL,
    hashed_otp VARCHAR(255) NOT NULL,
    attempts INT DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_otps_user ON verification_otps (user_id);
CREATE INDEX IF NOT EXISTS idx_otps_email ON verification_otps (email);

-- =============================================================================
-- 2. DOCUMENT INGESTION INTELLIGENCE SERVICE (Port 8003)
-- =============================================================================

CREATE TABLE IF NOT EXISTS documents (
    document_id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    file_type VARCHAR(32) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    storage_path VARCHAR(512) NOT NULL,
    status VARCHAR(32) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_documents_tenant ON documents (tenant_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents (status);

CREATE TABLE IF NOT EXISTS document_versions (
    version_id VARCHAR(64) PRIMARY KEY,
    document_id VARCHAR(64) REFERENCES documents(document_id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    content_hash VARCHAR(64) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_doc_versions_doc_id ON document_versions (document_id);

CREATE TABLE IF NOT EXISTS processing_jobs (
    job_id VARCHAR(64) PRIMARY KEY,
    document_id VARCHAR(64) REFERENCES documents(document_id) ON DELETE CASCADE,
    stage VARCHAR(64) NOT NULL,
    status VARCHAR(32) DEFAULT 'QUEUED',
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_processing_jobs_doc ON processing_jobs (document_id);

-- =============================================================================
-- 3. SEMANTIC SEARCH & RETRIEVAL SERVICE (Port 8001)
-- =============================================================================

CREATE TABLE IF NOT EXISTS retrieval_vector_index (
    vector_id VARCHAR(64) PRIMARY KEY,
    document_id VARCHAR(64) NOT NULL,
    chunk_index INT NOT NULL,
    chunk_text TEXT NOT NULL,
    embedding_dimension INT DEFAULT 1536,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_retrieval_vector_doc ON retrieval_vector_index (document_id);

CREATE TABLE IF NOT EXISTS retrieval_bm25_index (
    term_id VARCHAR(64) PRIMARY KEY,
    term VARCHAR(255) NOT NULL,
    document_id VARCHAR(64) NOT NULL,
    term_frequency FLOAT NOT NULL,
    field VARCHAR(64) DEFAULT 'content'
);
CREATE INDEX IF NOT EXISTS idx_bm25_term ON retrieval_bm25_index (term);

CREATE TABLE IF NOT EXISTS retrieval_search_audit (
    audit_id VARCHAR(64) PRIMARY KEY,
    query_text TEXT NOT NULL,
    tenant_id VARCHAR(64),
    results_count INT NOT NULL,
    latency_ms FLOAT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_search_audit_tenant ON retrieval_search_audit (tenant_id);

-- =============================================================================
-- 4. GROUNDED REASONING SERVICE (Port 8002)
-- =============================================================================

CREATE TABLE IF NOT EXISTS reasoning_session (
    session_id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64),
    prompt_query TEXT NOT NULL,
    reasoning_mode VARCHAR(64) DEFAULT 'STRICT_GROUNDED',
    status VARCHAR(32) DEFAULT 'COMPLETED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reasoning_trace (
    trace_id VARCHAR(64) PRIMARY KEY,
    session_id VARCHAR(64) REFERENCES reasoning_session(session_id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    tool_invoked VARCHAR(128),
    evidence_citation TEXT,
    confidence_score FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_trace_session ON reasoning_trace (session_id);

-- =============================================================================
-- 5. ENTERPRISE KNOWLEDGE SERVICE (Port 8005)
-- =============================================================================

CREATE TABLE IF NOT EXISTS knowledge_packages (
    package_id VARCHAR(64) PRIMARY KEY,
    package_name VARCHAR(255) NOT NULL,
    version VARCHAR(32) NOT NULL,
    okf_spec VARCHAR(32) DEFAULT 'OKF-v1.0',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS knowledge_documents (
    item_id VARCHAR(64) PRIMARY KEY,
    package_id VARCHAR(64) REFERENCES knowledge_packages(package_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS knowledge_relationships (
    rel_id VARCHAR(64) PRIMARY KEY,
    source_entity VARCHAR(255) NOT NULL,
    target_entity VARCHAR(255) NOT NULL,
    relation_type VARCHAR(64) NOT NULL,
    weight FLOAT DEFAULT 1.0
);
CREATE INDEX IF NOT EXISTS idx_rel_source ON knowledge_relationships (source_entity);
CREATE INDEX IF NOT EXISTS idx_rel_target ON knowledge_relationships (target_entity);

CREATE TABLE IF NOT EXISTS knowledge_audit_logs (
    log_id VARCHAR(64) PRIMARY KEY,
    action VARCHAR(64) NOT NULL,
    actor_id VARCHAR(64),
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 6. SAFETY COMPLIANCE INTELLIGENCE SERVICE (Port 8006)
-- =============================================================================

CREATE TABLE IF NOT EXISTS compliance_scans (
    scan_id VARCHAR(64) PRIMARY KEY,
    standard_name VARCHAR(128) NOT NULL, -- e.g. OSHA-1910, ISO-45001
    status VARCHAR(32) DEFAULT 'COMPLETED',
    scanned_documents_count INT DEFAULT 0,
    violations_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS compliance_findings (
    finding_id VARCHAR(64) PRIMARY KEY,
    scan_id VARCHAR(64) REFERENCES compliance_scans(scan_id) ON DELETE CASCADE,
    document_id VARCHAR(64),
    clause_reference VARCHAR(128) NOT NULL,
    severity VARCHAR(32) NOT NULL, -- CRITICAL, HIGH, MEDIUM, LOW
    description TEXT NOT NULL,
    remediation_suggestion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_compliance_scan ON compliance_findings (scan_id);

-- =============================================================================
-- 7. PREDICTIVE MAINTENANCE INTELLIGENCE SERVICE (Port 8007)
-- =============================================================================

CREATE TABLE IF NOT EXISTS equipment_health (
    equipment_id VARCHAR(64) PRIMARY KEY,
    equipment_tag VARCHAR(128) NOT NULL, -- e.g. PUMP-101-A
    health_score FLOAT DEFAULT 100.0,
    mtbf_hours_forecast FLOAT,
    status VARCHAR(32) DEFAULT 'OPTIMAL',
    last_inspected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_equipment_tag ON equipment_health (equipment_tag);

CREATE TABLE IF NOT EXISTS maintenance_findings (
    finding_id VARCHAR(64) PRIMARY KEY,
    equipment_id VARCHAR(64) REFERENCES equipment_health(equipment_id) ON DELETE CASCADE,
    anomaly_pattern VARCHAR(128) NOT NULL,
    severity VARCHAR(32) NOT NULL,
    recommended_action TEXT,
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS maintenance_telemetry (
    telemetry_id VARCHAR(64) PRIMARY KEY,
    equipment_id VARCHAR(64) REFERENCES equipment_health(equipment_id) ON DELETE CASCADE,
    temperature FLOAT,
    vibration_rms FLOAT,
    pressure_psi FLOAT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_telemetry_eq ON maintenance_telemetry (equipment_id);

-- =============================================================================
-- 8. WORKFORCE COPILOT / ASSISTANT SERVICE (Port 8010)
-- =============================================================================

CREATE TABLE IF NOT EXISTS conversations (
    conversation_id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    title VARCHAR(255) DEFAULT 'New Copilot Session',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations (user_id);

CREATE TABLE IF NOT EXISTS messages (
    message_id VARCHAR(64) PRIMARY KEY,
    conversation_id VARCHAR(64) REFERENCES conversations(conversation_id) ON DELETE CASCADE,
    sender_role VARCHAR(32) NOT NULL, -- user, assistant, system
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages (conversation_id);

CREATE TABLE IF NOT EXISTS message_tool_calls (
    call_id VARCHAR(64) PRIMARY KEY,
    message_id VARCHAR(64) REFERENCES messages(message_id) ON DELETE CASCADE,
    tool_name VARCHAR(128) NOT NULL,
    arguments JSONB DEFAULT '{}'::jsonb,
    output TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS message_citations (
    citation_id VARCHAR(64) PRIMARY KEY,
    message_id VARCHAR(64) REFERENCES messages(message_id) ON DELETE CASCADE,
    document_id VARCHAR(64),
    section_title VARCHAR(255),
    snippet TEXT,
    confidence_score FLOAT
);

CREATE TABLE IF NOT EXISTS message_feedback (
    feedback_id VARCHAR(64) PRIMARY KEY,
    message_id VARCHAR(64) REFERENCES messages(message_id) ON DELETE CASCADE,
    rating INT CHECK (rating IN (1, -1)), -- Thumbs up (1) or Thumbs down (-1)
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_preferences (
    preference_id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) UNIQUE NOT NULL,
    theme VARCHAR(32) DEFAULT 'dark',
    reasoning_mode VARCHAR(64) DEFAULT 'balanced',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 9. REAL-TIME NOTIFICATION SERVICE (Port 8009)
-- =============================================================================

CREATE TABLE IF NOT EXISTS notifications (
    notification_id VARCHAR(64) PRIMARY KEY,
    recipient VARCHAR(64) NOT NULL, -- user_id or 'all'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(32) DEFAULT 'INFO', -- INFO, WARNING, ALERT, SUCCESS
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notifications_rec ON notifications (recipient);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications (is_read);
