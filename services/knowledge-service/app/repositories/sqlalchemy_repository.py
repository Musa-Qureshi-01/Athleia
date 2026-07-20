"""Async SQLAlchemy Repository for Knowledge Service.
"""

from typing import Dict, List, Optional
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, create_async_engine
from sqlalchemy.orm import selectinload, sessionmaker

from app.core.config import settings
from app.domain.enums import DocumentCategory, PackageLifecycleState, RelationshipType
from app.domain.models import KnowledgeAuditRecord, OKFDocument, OKFPackage, OKFRelationship, Provenance
from app.repositories.db_models import Base, KnowledgeAuditRecordModel, KnowledgeDocumentRecord, KnowledgePackageRecord, KnowledgeRelationshipRecord


class KnowledgeRepository:
    """Async database repository managing Knowledge Packages, Documents, and Audit Logs."""

    def __init__(self, db_url: str = settings.DATABASE_URL):
        self.engine: AsyncEngine = create_async_engine(db_url, echo=False)
        self.async_session = sessionmaker(self.engine, class_=AsyncSession, expire_on_commit=False)

    async def init_db(self):
        """Initializes database tables."""
        async with self.engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    async def save_package(self, package: OKFPackage, performed_by: str = "system") -> OKFPackage:
        """Saves or updates OKFPackage and writes immutable audit trail."""
        async with self.async_session() as session:
            async with session.begin():
                # Check if package exists
                stmt = select(KnowledgePackageRecord).where(
                    KnowledgePackageRecord.package_urn == package.package_urn,
                    KnowledgePackageRecord.tenant_id == package.tenant_id
                ).options(
                    selectinload(KnowledgePackageRecord.documents),
                    selectinload(KnowledgePackageRecord.relationships)
                )
                res = await session.execute(stmt)
                existing = res.scalar_one_or_none()

                prev_state = existing.state if existing else None

                if existing:
                    # Update scalar fields
                    existing.title = package.title
                    existing.description = package.description
                    existing.version = package.version
                    existing.domain = package.domain
                    existing.state = package.state.value
                    existing.authors_json = package.authors
                    existing.metadata_json = package.metadata
                    existing.updated_at = package.updated_at

                    # Clear existing child items to re-insert
                    await session.execute(delete(KnowledgeDocumentRecord).where(KnowledgeDocumentRecord.package_id == existing.id))
                    await session.execute(delete(KnowledgeRelationshipRecord).where(KnowledgeRelationshipRecord.package_id == existing.id))
                    pkg_record = existing
                else:
                    pkg_record = KnowledgePackageRecord(
                        package_urn=package.package_urn,
                        title=package.title,
                        description=package.description,
                        version=package.version,
                        domain=package.domain,
                        state=package.state.value,
                        tenant_id=package.tenant_id,
                        authors_json=package.authors,
                        metadata_json=package.metadata,
                        created_at=package.created_at,
                        updated_at=package.updated_at,
                    )
                    session.add(pkg_record)
                    await session.flush()

                # Add Documents
                for doc in package.documents:
                    doc_rec = KnowledgeDocumentRecord(
                        package_id=pkg_record.id,
                        document_urn=doc.document_urn,
                        title=doc.title,
                        category=doc.category.value,
                        content=doc.content,
                        tags_json=doc.tags,
                        references_json=doc.references,
                        metadata_json=doc.metadata,
                        provenance_json={
                            "source_system": doc.provenance.source_system,
                            "ingestion_job_id": doc.provenance.ingestion_job_id,
                            "sha256_hash": doc.provenance.sha256_hash,
                            "original_filename": doc.provenance.original_filename,
                        } if doc.provenance else None
                    )
                    session.add(doc_rec)

                # Add Relationships
                for rel in package.relationships:
                    rel_rec = KnowledgeRelationshipRecord(
                        package_id=pkg_record.id,
                        source_urn=rel.source_urn,
                        target_urn=rel.target_urn,
                        relationship_type=rel.relationship_type.value,
                        properties_json=rel.properties,
                    )
                    session.add(rel_rec)

                # Audit Log Entry
                audit_rec = KnowledgeAuditRecordModel(
                    operation_id=f"op_{hash(package.package_urn + package.version) & 0xffffffff:08x}",
                    package_urn=package.package_urn,
                    action="SAVE_PACKAGE" if not existing else "UPDATE_PACKAGE",
                    performed_by=performed_by,
                    previous_state=prev_state,
                    new_state=package.state.value,
                    timestamp=package.updated_at,
                    details_json={"version": package.version, "document_count": len(package.documents)}
                )
                session.add(audit_rec)

        return package

    async def get_package(self, package_urn: str, tenant_id: str = "default_tenant") -> Optional[OKFPackage]:
        """Retrieves OKFPackage domain entity by URN."""
        async with self.async_session() as session:
            stmt = select(KnowledgePackageRecord).where(
                KnowledgePackageRecord.package_urn == package_urn,
                KnowledgePackageRecord.tenant_id == tenant_id
            ).options(
                selectinload(KnowledgePackageRecord.documents),
                selectinload(KnowledgePackageRecord.relationships)
            )
            res = await session.execute(stmt)
            rec = res.scalar_one_or_none()
            if not rec:
                return None

            return self._to_domain_package(rec)

    async def search_metadata(
        self,
        domain: Optional[str] = None,
        state: Optional[str] = None,
        tag: Optional[str] = None,
        query: Optional[str] = None,
        tenant_id: str = "default_tenant",
        limit: int = 50
    ) -> List[OKFPackage]:
        """Performs metadata, domain, state, and tag filtering on knowledge packages."""
        async with self.async_session() as session:
            stmt = select(KnowledgePackageRecord).where(
                KnowledgePackageRecord.tenant_id == tenant_id
            ).options(
                selectinload(KnowledgePackageRecord.documents),
                selectinload(KnowledgePackageRecord.relationships)
            )

            if domain:
                stmt = stmt.where(KnowledgePackageRecord.domain == domain)
            if state:
                stmt = stmt.where(KnowledgePackageRecord.state == state)

            res = await session.execute(stmt.limit(limit))
            records = res.scalars().all()

            packages = [self._to_domain_package(r) for r in records]

            # In-memory filter for query / tags
            if query or tag:
                filtered = []
                for pkg in packages:
                    matches_q = True
                    if query:
                        q_lower = query.lower()
                        matches_title = q_lower in pkg.title.lower() or q_lower in pkg.description.lower()
                        matches_doc = any(q_lower in doc.content.lower() or q_lower in doc.title.lower() for doc in pkg.documents)
                        matches_q = matches_title or matches_doc

                    matches_tag = True
                    if tag:
                        matches_tag = any(tag.lower() in [t.lower() for t in d.tags] for d in pkg.documents)

                    if matches_q and matches_tag:
                        filtered.append(pkg)
                return filtered

            return packages

    async def get_audit_logs(self, package_urn: str) -> List[Dict]:
        """Retrieves audit trail records for package."""
        async with self.async_session() as session:
            stmt = select(KnowledgeAuditRecordModel).where(
                KnowledgeAuditRecordModel.package_urn == package_urn
            ).order_by(KnowledgeAuditRecordModel.id.desc())
            res = await session.execute(stmt)
            records = res.scalars().all()
            return [
                {
                    "operation_id": r.operation_id,
                    "package_urn": r.package_urn,
                    "action": r.action,
                    "performed_by": r.performed_by,
                    "previous_state": r.previous_state,
                    "new_state": r.new_state,
                    "timestamp": r.timestamp,
                    "details": r.details_json
                }
                for r in records
            ]

    def _to_domain_package(self, rec: KnowledgePackageRecord) -> OKFPackage:
        """Maps SQLAlchemy database record to OKFPackage domain entity."""
        docs = []
        for d in rec.documents:
            prov = None
            if d.provenance_json:
                prov = Provenance(
                    source_system=d.provenance_json.get("source_system", "UNKNOWN"),
                    ingestion_job_id=d.provenance_json.get("ingestion_job_id"),
                    sha256_hash=d.provenance_json.get("sha256_hash"),
                    original_filename=d.provenance_json.get("original_filename"),
                )
            docs.append(
                OKFDocument(
                    document_urn=d.document_urn,
                    title=d.title,
                    category=DocumentCategory(d.category),
                    content=d.content,
                    tags=d.tags_json or [],
                    references=d.references_json or [],
                    metadata=d.metadata_json or {},
                    provenance=prov,
                )
            )

        rels = [
            OKFRelationship(
                source_urn=r.source_urn,
                target_urn=r.target_urn,
                relationship_type=RelationshipType(r.relationship_type),
                properties=r.properties_json or {},
            )
            for r in rec.relationships
        ]

        return OKFPackage(
            package_urn=rec.package_urn,
            title=rec.title,
            description=rec.description or "",
            version=rec.version,
            domain=rec.domain,
            authors=rec.authors_json or [],
            state=PackageLifecycleState(rec.state),
            metadata=rec.metadata_json or {},
            tenant_id=rec.tenant_id,
            created_at=rec.created_at,
            updated_at=rec.updated_at,
            documents=docs,
            relationships=rels,
        )


repository = KnowledgeRepository()
