"""Result Reranker & Citation Evidence Formatting Engine.

Boosts equipment tag exact matches, drawing title matches, and formats structured
citation provenance metadata for downstream consumption.
"""

import re
from typing import List
from app.schemas.search import SearchResultItem


class ResultReranker:
    """Reranks search results based on equipment tag matches and formats citation provenance."""

    @classmethod
    def rerank(cls, query: str, results: List[SearchResultItem]) -> List[SearchResultItem]:
        if not results:
            return []

        # Extract equipment and tag tokens from query (e.g. P-101A, PT-101, VLV-302)
        query_tags = set(re.findall(r"\b(?:P|VLV|TK|PT|FT|TT|CT|HEX|COMP)-[0-9]{3,4}[A-Z]?\b", query.upper()))
        query_words = set(re.findall(r"\w+", query.lower()))

        reranked_items: List[SearchResultItem] = []

        for item in results:
            boost = 1.0
            content_upper = item.content.upper()
            content_lower = item.content.lower()

            # 1. Boost exact equipment tag match (+20% score boost per matched tag)
            for tag in query_tags:
                if tag in content_upper:
                    boost += 0.20

            # 2. Boost exact section/title match (+10% score boost)
            if item.section_path:
                sec_lower = item.section_path.lower()
                for word in query_words:
                    if len(word) > 3 and word in sec_lower:
                        boost += 0.10
                        break

            new_score = round(item.score * boost, 5)

            # Build enriched citation evidence block
            filename = item.metadata.get("filename", "document.pdf")
            page_str = f"Page {item.page_number}" if item.page_number else "Page 1"
            sec_str = item.section_path or "Document Body"
            evidence_snippet = f"[{filename} | {page_str} | {sec_str}]: \"{item.content[:150]}...\""

            reranked_item = item.model_copy()
            reranked_item.score = new_score
            reranked_item.evidence = evidence_snippet
            reranked_items.append(reranked_item)

        # Re-sort results by updated boosted score
        reranked_items.sort(key=lambda x: x.score, reverse=True)
        return reranked_items


result_reranker = ResultReranker()
