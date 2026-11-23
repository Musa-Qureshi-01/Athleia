"""Unit test for EmbeddingManager.
"""

import pytest
from app.services.embedding_manager import EmbeddingManager, embedding_manager


def test_embedding_encoding_dimension():
    vec = embedding_manager.encode_text("Centrifugal Pump P-101A maintenance procedure")
    assert len(vec) == 384
    assert isinstance(vec, list)
    assert all(isinstance(x, float) for x in vec)


def test_cosine_similarity_identical_vectors():
    vec = embedding_manager.encode_text("Pressure Transmitter PT-101")
    score = EmbeddingManager.cosine_similarity(vec, vec)
    assert round(score, 4) == 1.0


def test_cosine_similarity_relevant_query():
    vec1 = embedding_manager.encode_text("Pump P-101A monitored by PT-101")
    vec2 = embedding_manager.encode_text("Pump P-101A PT-101 pressure tag")
    score = EmbeddingManager.cosine_similarity(vec1, vec2)
    assert score > 0.0
