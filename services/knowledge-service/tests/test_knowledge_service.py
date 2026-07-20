"""Unit & Integration Tests for Knowledge Service.
"""

import pytest
from fastapi.testclient import TestClient
from app.adapters.markdown.markdown_adapter import markdown_adapter
from app.adapters.okf.okf_adapter import okf_adapter
from app.core.errors import InvalidStateTransitionError, ValidationError
from app.domain.enums import DocumentCategory, PackageLifecycleState, RelationshipType
from app.domain.lifecycle_service import lifecycle_service
from app.domain.models import OKFDocument, OKFPackage, OKFRelationship, Provenance
from app.main import app
from app.validation.package_validator import package_validator
from app.validation.relationship_validator import relationship_validator

client = TestClient(app)


def test_health_endpoint():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["service"] == "knowledge-service"


def test_okf_adapter_import_and_export():
    raw_data = {
        "package_urn": "urn:athleia:pkg:cooling-water-sop",
        "title": "Cooling Water System Operating Procedure",
        "description": "Standard Operating Procedure for Cooling Water Station 101",
        "version": "1.0.0",
        "domain": "Industrial Operations",
        "authors": ["Lead Chemist", "Plant Safety Lead"],
        "state": "DRAFT",
        "documents": [
            {
                "document_urn": "urn:athleia:doc:cw-sop-01",
                "title": "Cooling Water Startup SOP",
                "category": "SOP",
                "content": "Verify suction pressure on PT-101 prior to starting Pump P-101A.",
                "tags": ["sop", "cooling_water", "safety"],
                "provenance": {
                    "source_system": "INGESTION_SERVICE",
                    "ingestion_job_id": "job_99812",
                    "sha256_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                    "original_filename": "CW_SOP_2026.pdf",
                },
            }
        ],
        "relationships": [],
    }

    pkg = okf_adapter.import_from_dict(raw_data)
    assert pkg.package_urn == "urn:athleia:pkg:cooling-water-sop"
    assert len(pkg.documents) == 1
    assert pkg.documents[0].category == DocumentCategory.SOP

    exported = okf_adapter.export_to_dict(pkg)
    assert exported["okf_version"] == "1.0.0"
    assert exported["package_urn"] == pkg.package_urn

    zip_bytes = okf_adapter.export_to_zip(pkg)
    assert len(zip_bytes) > 0


def test_package_validation_success():
    pkg = OKFPackage(
        package_urn="urn:athleia:pkg:test-01",
        title="Test Package",
        description="Testing validator",
        version="1.0.0",
        domain="Engineering",
        documents=[
            OKFDocument(
                document_urn="urn:athleia:doc:test-doc-01",
                title="Test Spec",
                category=DocumentCategory.EQUIPMENT_SPEC,
                content="Operating limit 150 PSI.",
            )
        ],
    )
    errors = package_validator.validate(pkg)
    assert len(errors) == 0


def test_package_validation_failure():
    pkg = OKFPackage(
        package_urn="invalid_urn",
        title="",
        description="",
        version="invalid_semver",
        domain="",
        documents=[],
    )
    with pytest.raises(ValidationError):
        package_validator.validate(pkg)


def test_relationship_validator():
    pkg = OKFPackage(
        package_urn="urn:athleia:pkg:test-rel",
        title="Rel Package",
        description="Testing relationships",
        version="1.0.0",
        domain="Engineering",
        documents=[
            OKFDocument(
                document_urn="urn:athleia:doc:pump-101",
                title="Pump 101 Spec",
                category=DocumentCategory.EQUIPMENT_SPEC,
                content="Centrifugal Pump P-101A",
            )
        ],
        relationships=[
            OKFRelationship(
                source_urn="urn:athleia:doc:pump-101",
                target_urn="urn:athleia:doc:pump-101",
                relationship_type=RelationshipType.DEPENDS_ON,
            )
        ],
    )
    with pytest.raises(ValidationError) as exc:
        relationship_validator.validate(pkg)
    assert any("self-referential loop" in err for err in exc.value.errors)


def test_lifecycle_state_machine():
    pkg = OKFPackage(
        package_urn="urn:athleia:pkg:lifecycle",
        title="Lifecycle Test",
        description="State machine validation",
        version="1.0.0",
        domain="Engineering",
        state=PackageLifecycleState.DRAFT,
    )

    # DRAFT -> VALIDATED (valid)
    lifecycle_service.transition(pkg, PackageLifecycleState.VALIDATED)
    assert pkg.state == PackageLifecycleState.VALIDATED

    # VALIDATED -> PUBLISHED (valid)
    lifecycle_service.transition(pkg, PackageLifecycleState.PUBLISHED)
    assert pkg.state == PackageLifecycleState.PUBLISHED

    # PUBLISHED -> DRAFT (invalid transition)
    with pytest.raises(InvalidStateTransitionError):
        lifecycle_service.transition(pkg, PackageLifecycleState.DRAFT)


def test_markdown_adapter():
    raw_md = """---
title: Maintenance SOP 101
urn: urn:athleia:doc:maint-101
tags: [maintenance, sop, cooling_water]
version: 1.0.0
---

# Maintenance Section
Inspect seal rings on Pump P-101A every 6 months.
"""
    pkg = markdown_adapter.import_from_markdown(raw_md)
    assert len(pkg.documents) == 1
    assert pkg.documents[0].title == "Maintenance SOP 101"
    assert "maintenance" in pkg.documents[0].tags


def test_api_import_and_search():
    with TestClient(app) as test_client:
        payload = {
            "package_urn": "urn:athleia:pkg:api-test-01",
            "title": "API Integration Test Package",
            "description": "Integration test package payload",
            "version": "1.0.0",
            "domain": "API Testing",
            "authors": ["Automated Test"],
            "documents": [
                {
                    "document_urn": "urn:athleia:doc:api-doc-01",
                    "title": "API Document Spec",
                    "category": "STANDARD",
                    "content": "API routing rules and schema compliance parameters.",
                    "tags": ["api", "spec"],
                }
            ],
        }

        # Import
        res = test_client.post("/api/v1/knowledge/import", json=payload)
        assert res.status_code == 201
        assert res.json()["status"] == "success"

        # Search
        search_res = test_client.post("/api/v1/knowledge/search", json={"query": "API routing"})
        assert search_res.status_code == 200
        results = search_res.json()
        assert results["count"] >= 1
