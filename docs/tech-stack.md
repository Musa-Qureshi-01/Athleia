# Technical Stack

## Ingestion Service (`services/Ingestion-service/`)

- **Language & Runtime**: Python 3.12
- **Web Framework**: FastAPI (Async Web REST API framework)
- **ASGI Server**: Uvicorn
- **Data Validation & Settings**: Pydantic v2 & Pydantic-Settings
- **Database & Persistence**: Neon PostgreSQL (AWS East) via SQLAlchemy 2.0 (Async ORM) + `asyncpg` (Async SQLite fallback `aiosqlite` for local unit tests)
- **File Storage**: Amazon S3 Bucket (`athleia-ingestion-bucket-256461399444-eu-north-1-an`, Region `eu-north-1` Stockholm) via `boto3` + Local content-addressable storage provider fallback (`aiofiles`)
- **File Upload Parsing**: `python-multipart`
- **Document Text & Layout Parsing**: `pypdf`, `python-docx`
- **Image Preprocessing & OCR Engine**: `Pillow`, `pytesseract` (Tesseract OCR wrapper), `opencv-python-headless`
- **Structured Telemetry & Logging**: `structlog` (JSON structured logging with trace context)
- **Testing Suite**: `pytest`, `pytest-asyncio`, `httpx`

## Retrieval Service (`services/semantic-serach-(retrievel)-service/`)

- **Language & Runtime**: Python 3.12
- **Web Framework**: FastAPI (Async Web REST API framework)
- **ASGI Server**: Uvicorn
- **Data Validation & Settings**: Pydantic v2 & Pydantic-Settings
- **Dense Vector Search**: Open-source local embeddings (`BAAI/bge-small-en-v1.5` / `sentence-transformers`) + Cosine Vector Engine / pgvector
- **Sparse Keyword Search**: Open-source BM25 Keyword Search Engine (`rank_bm25` / PostgreSQL tsvector)
- **Hybrid Search Fusion**: Reciprocal Rank Fusion (RRF) & Metadata Filter Engine
- **Database & Persistence**: Neon PostgreSQL via SQLAlchemy 2.0 (Async ORM) + `asyncpg` (Async SQLite fallback `aiosqlite` for local unit tests)
- **Structured Logging**: `structlog`
- **Testing Suite**: `pytest`, `pytest-asyncio`, `httpx`

## Reasoning Service (`services/reasoning-service/`)

- **Language & Runtime**: Python 3.12
- **Web Framework**: FastAPI (Async Web REST API framework)
- **ASGI Server**: Uvicorn
- **Data Validation & Settings**: Pydantic v2 & Pydantic-Settings
- **4-Tier Knowledge Priority Orchestrator**: Priority 1 (Enterprise Docs/SOPs/P&IDs) $\rightarrow$ Priority 2 (Asset DBs) $\rightarrow$ Priority 3 (Public Standards) $\rightarrow$ Priority 4 (Web Search)
- **Tool Orchestrator & Evidence Collector**: Modular internal & industrial tool registry
- **Grounded Reasoning & Faithfulness Evaluator**: Deterministic evidence grounding & confidence scorer
- **Database & Persistence**: Neon PostgreSQL via SQLAlchemy 2.0 (Async ORM) + `asyncpg` (Async SQLite fallback `aiosqlite` for unit tests)
- **Structured Telemetry**: `structlog` (JSON telemetry with request/session trace IDs)
- **Testing Suite**: `pytest`, `pytest-asyncio`, `httpx`
