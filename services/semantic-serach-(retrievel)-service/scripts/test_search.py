"""CLI Search & Retrieval Tester for Athleia Retrieval Service.

Usage:
    py -3.12 scripts/test_search.py "Your industrial query here"
"""

import json
import sys
import httpx

SERVER_URL = "http://127.0.0.1:8001"


def test_index_sample_doc():
    print("-------------------------------------------------------")
    print(" Indexing Sample P&ID Drawing & SOP Chunks")
    print("-------------------------------------------------------")
    
    index_payload = {
        "document_id": "doc_demo_pid_001",
        "logical_document_id": "log_demo_001",
        "filename": "PND-4012_PUMP_STATION_PID.pdf",
        "file_hash": "hash_pid_demo",
        "mime_type": "application/pdf",
        "size_bytes": 2048,
        "metadata": {
            "category": "ENGINEERING",
            "subtype": "P_AND_ID",
            "document_number": "PND-4012",
            "revision": "B",
            "equipment_references": ["P-101A", "PT-101", "FT-204", "VLV-302", "TK-201"]
        },
        "chunks": [
            {
                "chunk_id": "chk_demo_01",
                "content": "Centrifugal Pump P-101A is monitored by Pressure Transmitter PT-101 in Cooling Water Station 101.",
                "page_number": 1,
                "section_path": "Title Block > Equipment Overview"
            },
            {
                "chunk_id": "chk_demo_02",
                "content": "Flow Transmitter FT-204 measures volumetric flow rate on Line 6\"-CW-101-CS150.",
                "page_number": 1,
                "section_path": "Piping & Instrumentation"
            },
            {
                "chunk_id": "chk_demo_03",
                "content": "Emergency Valve VLV-302 controls isolation on line 6\"-CW-101-CS150.",
                "page_number": 1,
                "section_path": "Piping & Instrumentation"
            },
            {
                "chunk_id": "chk_demo_04",
                "content": "Storage Tank TK-201 feeds Pump P-101A suction line. Maintenance procedure requires verifying PT-101.",
                "page_number": 2,
                "section_path": "SOP Procedure Steps"
            }
        ]
    }

    resp = httpx.post(f"{SERVER_URL}/api/v1/index", json=index_payload, timeout=10.0)
    if resp.status_code in [200, 201]:
        print("[OK] Document chunks indexed successfully!")
    else:
        print(f"[ERROR] Indexing failed ({resp.status_code}): {resp.text}")


def test_search(query: str, search_type: str = "HYBRID"):
    print(f"\n=======================================================")
    print(f" Executing Retrieval Search")
    print(f" Query: \"{query}\"")
    print(f" Strategy: {search_type}")
    print(f"=======================================================\n")

    search_payload = {
        "query": query,
        "search_type": search_type,
        "top_k": 5
    }

    resp = httpx.post(f"{SERVER_URL}/api/v1/search", json=search_payload, timeout=10.0)
    if resp.status_code != 200:
        print(f"[ERROR] Search Request Failed ({resp.status_code}): {resp.text}")
        return

    data = resp.json()["data"]
    print(f"[OK] Search Completed in {data['execution_time_ms']} ms!")
    print(f"   Total Results: {data['total_results']}")

    for idx, item in enumerate(data["results"]):
        print(f"\n [{idx+1}] Score: {item['score']} | Strategy: {item['source_type']}")
        print(f"     Content: \"{item['content']}\"")
        print(f"     Evidence Citation: {item.get('evidence')}")


if __name__ == "__main__":
    query_str = sys.argv[1] if len(sys.argv) > 1 else "Pressure Transmitter PT-101 pump P-101A"
    try:
        test_index_sample_doc()
        test_search(query_str, "HYBRID")
    except Exception as e:
        print(f"Error executing CLI search test (make sure server is running on http://127.0.0.1:8001): {e}")
