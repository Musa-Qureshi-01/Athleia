"""Integration tests for Table, Image, and Visual Bounding Box Extractors.
"""

import pytest
from app.domain.models import IndustrialEntity, EntityType
from app.services.extractors.image_extractor import ImageExtractor
from app.services.extractors.table_extractor import TableExtractor
from app.services.extractors.visual_extractor import VisualExtractor


def test_table_extractor_parses_markdown_table():
    sample_markdown = """
| Parameter | Value | Unit |
|---|---|---|
| Suction Pressure | 150 | PSI |
| Discharge Temp | 85 | C |
    """

    tables = TableExtractor.extract_tables(sample_markdown)
    assert len(tables) == 1
    tbl = tables[0]
    assert tbl.headers == ["Parameter", "Value", "Unit"]
    assert len(tbl.rows) == 2
    assert tbl.rows[0] == ["Suction Pressure", "150", "PSI"]


def test_visual_extractor_attaches_spatial_bounding_boxes():
    entities = [
        IndustrialEntity(id="e1", name="PT-101", entity_type=EntityType.INSTRUMENT_TAG),
        IndustrialEntity(id="e2", name="P-101A", entity_type=EntityType.EQUIPMENT)
    ]

    bounded = VisualExtractor.attach_bounding_boxes(entities)
    assert bounded[0].bounding_box is not None
    assert bounded[0].bounding_box.x_min >= 0.0
    assert bounded[1].bounding_box is not None


def test_image_extractor_captures_figures():
    figures = ImageExtractor.extract_figures(b"fake_pdf_bytes", "sample_pnd_drawing.pdf")
    assert len(figures) == 1
    assert figures[0].image_id == "img_title_block_01"
    assert figures[0].bounding_box is not None
