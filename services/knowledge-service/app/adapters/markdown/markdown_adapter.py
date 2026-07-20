"""Markdown & Frontmatter Format Adapter for Knowledge Service.
"""

from typing import List
import frontmatter
from app.domain.enums import DocumentCategory, PackageLifecycleState
from app.domain.models import OKFDocument, OKFPackage, Provenance


class MarkdownAdapter:
    """Parses raw Markdown string with YAML frontmatter into OKFPackage domain object."""

    FORMAT_NAME = "markdown"

    @classmethod
    def import_from_markdown(cls, raw_md: str, title: str = "Imported Markdown Doc", domain: str = "General") -> OKFPackage:
        """Parses Markdown text with frontmatter into a single-document OKFPackage."""
        post = frontmatter.loads(raw_md)
        metadata = dict(post.metadata)
        content = post.content

        doc_urn = metadata.get("urn", f"urn:athleia:doc:md-{hash(content) & 0xffffffff:08x}")
        doc_title = metadata.get("title", title)
        tags = metadata.get("tags", [])

        doc = OKFDocument(
            document_urn=doc_urn,
            title=doc_title,
            category=DocumentCategory.GENERAL,
            content=content,
            tags=tags if isinstance(tags, list) else [str(tags)],
            provenance=Provenance(source_system="MARKDOWN_IMPORT"),
            metadata=metadata,
        )

        pkg_urn = metadata.get("package_urn", f"urn:athleia:pkg:md-{hash(content) & 0xffffffff:08x}")

        return OKFPackage(
            package_urn=pkg_urn,
            title=doc_title,
            description="Imported from Markdown Document",
            version=metadata.get("version", "1.0.0"),
            domain=domain,
            authors=metadata.get("authors", ["System Import"]),
            state=PackageLifecycleState.DRAFT,
            documents=[doc],
        )


markdown_adapter = MarkdownAdapter()
