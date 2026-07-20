"""Open-Source Table Extractor for Industrial Document Intelligence Service.

Parses multi-column technical grids, key-value specifications, maintenance logs,
and datasheet matrices into structured DocumentTable models.
"""

import re
from typing import List, Optional
from app.domain.models import BoundingBox, DocumentTable


class TableExtractor:
    """Extracts structured tables from document text and layout streams."""

    @classmethod
    def extract_tables(cls, raw_text: str) -> List[DocumentTable]:
        tables: List[DocumentTable] = []
        lines = [line.strip() for line in raw_text.split("\n") if line.strip()]

        # 1. Pipe-separated Markdown/ASCII Tables (| Header 1 | Header 2 |)
        table_lines = []
        current_table_title = "Specification Table"

        for idx, line in enumerate(lines):
            if "|" in line and len(line.split("|")) >= 3:
                table_lines.append(line)
            else:
                if len(table_lines) >= 2:
                    parsed_table = cls._parse_markdown_table(table_lines, len(tables) + 1)
                    if parsed_table:
                        tables.append(parsed_table)
                table_lines = []

        if len(table_lines) >= 2:
            parsed_table = cls._parse_markdown_table(table_lines, len(tables) + 1)
            if parsed_table:
                tables.append(parsed_table)

        # 2. Key-Value / Tabular Grid Heuristics (e.g. PARAMETER   VALUE   UNIT)
        if not tables:
            grid_table = cls._parse_tabular_grid(lines)
            if grid_table:
                tables.append(grid_table)

        return tables

    @classmethod
    def _parse_markdown_table(cls, raw_lines: List[str], table_num: int) -> Optional[DocumentTable]:
        rows = []
        for line in raw_lines:
            # Skip divider lines (|---|---|)
            if re.match(r"^\s*\|?\s*:?-+:?\s*(\|?\s*:?-+:?\s*)*\|?\s*$", line):
                continue
            cols = [col.strip() for col in line.split("|") if col.strip()]
            if cols:
                rows.append(cols)

        if not rows or len(rows) < 2:
            return None

        headers = rows[0]
        data_rows = rows[1:]

        return DocumentTable(
            table_id=f"tbl_{table_num:02d}",
            page_number=1,
            title=f"Extracted Table #{table_num}",
            headers=headers,
            rows=data_rows,
            bounding_box=BoundingBox(page_number=1, x_min=50.0, y_min=200.0, x_max=550.0, y_max=400.0)
        )

    @classmethod
    def _parse_tabular_grid(cls, lines: List[str]) -> Optional[DocumentTable]:
        grid_rows = []
        for line in lines:
            # Match multi-space separated columns (e.g., "Pressure    150    PSI")
            cols = [c.strip() for c in re.split(r"\s{2,}", line) if c.strip()]
            if len(cols) >= 2:
                grid_rows.append(cols)

        if len(grid_rows) >= 3:
            return DocumentTable(
                table_id="tbl_grid_01",
                page_number=1,
                title="Industrial Technical Datasheet Grid",
                headers=grid_rows[0],
                rows=grid_rows[1:10],
                bounding_box=BoundingBox(page_number=1, x_min=40.0, y_min=150.0, x_max=560.0, y_max=500.0)
            )

        return None
