"""CLI Reasoning & Knowledge AI Tester for Athleia Reasoning Service.

Usage:
    py -3.12 scripts/test_reasoning.py "Your industrial question here"
"""

import json
import sys
import httpx

SERVER_URL = "http://127.0.0.1:8002"


def test_reasoning(query: str, allow_external: bool = False):
    print(f"\n=======================================================")
    print(f" Executing Grounded Industrial AI Reasoning")
    print(f" Query: \"{query}\"")
    print(f" Allow External Knowledge: {allow_external}")
    print(f"=======================================================\n")

    payload = {
        "query": query,
        "allow_external_knowledge": allow_external
    }

    try:
        resp = httpx.post(f"{SERVER_URL}/api/v1/reason", json=payload, timeout=15.0)
        if resp.status_code != 200:
            print(f"[ERROR] Reasoning Request Failed ({resp.status_code}): {resp.text}")
            return

        data = resp.json()["data"]

        print(f"[OK] Intent Category: {data['intent_category']}")
        print(f"[OK] Grounding Confidence: {data['evaluation']['overall_confidence']} (Grounding: {data['evaluation']['grounding_score']})")
        print(f"\n-------------------------------------------------------")
        print(" GROUNDED RESPONSE")
        print("-------------------------------------------------------")
        print(data['grounded_answer'])

        print(f"\n-------------------------------------------------------")
        print(f" CITATIONS & EVIDENCE SOURCES ({len(data['citations'])})")
        print("-------------------------------------------------------")
        for cite in data['citations']:
            print(f" {cite['citation_id']} Source: {cite['source_name']} (Page {cite['page_number']}) | Section: {cite['section_path']}")

    except Exception as e:
        print(f"[ERROR] Failed connecting to Reasoning Service (make sure server is running on http://127.0.0.1:8002): {e}")


if __name__ == "__main__":
    query_str = sys.argv[1] if len(sys.argv) > 1 else "What is the suction pressure for Pump P-101A monitored by PT-101?"
    test_reasoning(query_str, False)
