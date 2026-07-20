"""Integration test for EngineeringDrawingPipeline.
"""

import pytest
from app.domain.taxonomy import DocumentCategory, DocumentSubtype
from app.pipelines.engineering_pipeline import EngineeringPipeline


@pytest.mark.asyncio
async def test_engineering_pipeline_extracts_pid_tags_and_topology():
    pipeline = EngineeringPipeline()
    pid_content = (
        b"%PDF-1.4\n"
        b"DRAWING NO: PND-4012  REV: B\n"
        b"P&ID PUMP STATION 101 PIPING DIAGRAM\n"
        b"Centrifugal Pump P-101A is monitored by Pressure Transmitter PT-101.\n"
        b"Flow Transmitter FT-204 is connected to Valve VLV-302 on Line 6\"-CW-101-CS150.\n"
        b"%%EOF"
    )

    normalized = await pipeline.process(
        document_id="doc_test_pid_01",
        logical_document_id="log_pid_01",
        filename="PND-4012_PUMP_STATION_PID.pdf",
        file_hash="hash_pid_01",
        mime_type="application/pdf",
        size_bytes=len(pid_content),
        category=DocumentCategory.ENGINEERING,
        subtype=DocumentSubtype.P_AND_ID,
        content=pid_content
    )

    assert normalized.metadata.document_number == "PND-4012"
    assert normalized.metadata.revision == "B"
    assert "P-101A" in normalized.metadata.equipment_references

    entity_names = [e.name for e in normalized.entities]
    assert "PT-101" in entity_names
    assert "FT-204" in entity_names
    assert "P-101A" in entity_names

    # Verify topology relationships built
    assert len(normalized.relationships) > 0
    rel_types = [r.relation_type.value for r in normalized.relationships]
    assert "MONITORS" in rel_types or "CONTROLS" in rel_types
