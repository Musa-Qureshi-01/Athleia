"""Google Open Knowledge Format (OKF v1.0) Adapter.
"""

import io
import json
import zipfile
from typing import Any, Dict, Tuple
from app.core.errors import AdapterError
from app.domain.enums import DocumentCategory, PackageLifecycleState, RelationshipType
from app.domain.models import OKFDocument, OKFPackage, OKFRelationship, Provenance


class OKFAdapter:
    """Imports and Exports Open Knowledge Format (OKF v1.0) packages."""

    FORMAT_NAME = "okf"
    OKF_SPEC_VERSION = "1.0.0"

    @classmethod
    def import_from_dict(cls, data: Dict[str, Any]) -> OKFPackage:
        """Parses OKF package dictionary into normalized OKFPackage domain entity."""
        try:
            docs: list[OKFDocument] = []
            for d in data.get("documents", []):
                prov_data = d.get("provenance")
                prov = None
                if prov_data:
                    prov = Provenance(
                        source_system=prov_data.get("source_system", "INGESTION_SERVICE"),
                        ingestion_job_id=prov_data.get("ingestion_job_id"),
                        sha256_hash=prov_data.get("sha256_hash"),
                        original_filename=prov_data.get("original_filename"),
                    )

                doc_cat = DocumentCategory.GENERAL
                if d.get("category"):
                    try:
                        doc_cat = DocumentCategory(d["category"])
                    except ValueError:
                        doc_cat = DocumentCategory.GENERAL

                docs.append(
                    OKFDocument(
                        document_urn=d.get("document_urn", ""),
                        title=d.get("title", ""),
                        category=doc_cat,
                        content=d.get("content", ""),
                        tags=d.get("tags", []),
                        provenance=prov,
                        references=d.get("references", []),
                        metadata=d.get("metadata", {}),
                    )
                )

            rels: list[OKFRelationship] = []
            for r in data.get("relationships", []):
                rel_type = RelationshipType.REFERENCES
                if r.get("relationship_type"):
                    try:
                        rel_type = RelationshipType(r["relationship_type"])
                    except ValueError:
                        rel_type = RelationshipType.REFERENCES

                rels.append(
                    OKFRelationship(
                        source_urn=r.get("source_urn", ""),
                        target_urn=r.get("target_urn", ""),
                        relationship_type=rel_type,
                        properties=r.get("properties", {}),
                    )
                )

            state = PackageLifecycleState.DRAFT
            if data.get("state"):
                try:
                    state = PackageLifecycleState(data["state"])
                except ValueError:
                    state = PackageLifecycleState.DRAFT

            return OKFPackage(
                package_urn=data.get("package_urn", ""),
                title=data.get("title", ""),
                description=data.get("description", ""),
                version=data.get("version", "1.0.0"),
                domain=data.get("domain", "Industrial"),
                authors=data.get("authors", []),
                state=state,
                documents=docs,
                relationships=rels,
                metadata=data.get("metadata", {}),
                tenant_id=data.get("tenant_id", "default_tenant"),
            )
        except Exception as e:
            raise AdapterError(f"Failed to parse OKF package: {str(e)}") from e

    @classmethod
    def export_to_dict(cls, package: OKFPackage) -> Dict[str, Any]:
        """Serializes OKFPackage entity into canonical OKF v1.0 dictionary."""
        return {
            "okf_version": cls.OKF_SPEC_VERSION,
            "package_urn": package.package_urn,
            "title": package.title,
            "description": package.description,
            "version": package.version,
            "domain": package.domain,
            "authors": package.authors,
            "state": package.state.value,
            "tenant_id": package.tenant_id,
            "created_at": package.created_at,
            "updated_at": package.updated_at,
            "metadata": package.metadata,
            "documents": [
                {
                    "document_urn": doc.document_urn,
                    "title": doc.title,
                    "category": doc.category.value,
                    "content": doc.content,
                    "tags": doc.tags,
                    "references": doc.references,
                    "metadata": doc.metadata,
                    "provenance": {
                        "source_system": doc.provenance.source_system if doc.provenance else "UNKNOWN",
                        "ingestion_job_id": doc.provenance.ingestion_job_id if doc.provenance else None,
                        "sha256_hash": doc.provenance.sha256_hash if doc.provenance else None,
                        "original_filename": doc.provenance.original_filename if doc.provenance else None,
                    } if doc.provenance else None,
                }
                for doc in package.documents
            ],
            "relationships": [
                {
                    "source_urn": rel.source_urn,
                    "target_urn": rel.target_urn,
                    "relationship_type": rel.relationship_type.value,
                    "properties": rel.properties,
                }
                for rel in package.relationships
            ],
        }

    @classmethod
    def export_to_zip(cls, package: OKFPackage) -> bytes:
        """Serializes OKFPackage entity into downloadable .zip package archive."""
        buffer = io.BytesIO()
        with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as zf:
            # Write okf.package.json manifest
            pkg_dict = cls.export_to_dict(package)
            zf.writestr("okf.package.json", json.dumps(pkg_dict, indent=2))

            # Write individual Markdown document files
            for doc in package.documents:
                filename = f"documents/{doc.document_urn.replace(':', '_')}.okf.md"
                md_content = f"# {doc.title}\n\n<!-- OKF_METADATA: {json.dumps(doc.metadata)} -->\n\n{doc.content}"
                zf.writestr(filename, md_content)

        buffer.seek(0)
        return buffer.getvalue()


okf_adapter = OKFAdapter()
