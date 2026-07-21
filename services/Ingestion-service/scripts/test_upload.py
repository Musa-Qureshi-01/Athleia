"""CLI Upload & Normalization Tester for Industrial Document Intelligence Service.

Usage:
    py -3.12 scripts/test_upload.py path/to/your/actual_drawing_or_doc.pdf
"""

import json
import sys
import httpx


def test_upload(file_path: str, server_url: str = "http://127.0.0.1:8000"):
    print(f"\n=======================================================")
    print(f" Uploading File to Athleia Document Intelligence")
    print(f" File: {file_path}")
    print(f"=======================================================\n")

    upload_url = f"{server_url}/api/v1/documents/upload"
    
    with open(file_path, "rb") as f:
        filename = file_path.rsplit("\\", 1)[-1].rsplit("/", 1)[-1]
        files = {"file": (filename, f, "application/pdf" if filename.endswith(".pdf") else "application/octet-stream")}
        
        print("Sending upload request...")
        resp = httpx.post(upload_url, files=files, timeout=30.0)
        
        if resp.status_code not in [200, 202]:
            print(f"[FAIL] Upload Failed ({resp.status_code}):")
            print(resp.text)
            return None

        payload = resp.json()
        doc_id = payload["data"]["document_id"]
        print(f"[SUCCESS] Upload Accepted!")
        print(f"   Document ID: {doc_id}")
        print(f"   Task ID: {payload['data']['task_id']}")
        print(f"   Processing State: {payload['data']['processing_state']}")

        # Retrieve Normalized Knowledge Model
        norm_url = f"{server_url}/api/v1/documents/{doc_id}/normalized"
        norm_resp = httpx.get(norm_url, timeout=30.0)
        if norm_resp.status_code == 200:
            norm_data = norm_resp.json()["data"]
            print("\n=======================================================")
            print(" EXTRACTED NORMALIZED KNOWLEDGE REPRESENTATION")
            print("=======================================================")
            print(f" Category: {norm_data.get('classification', {}).get('category', 'GENERAL')}")
            print(f" Title: {norm_data['metadata'].get('title')}")
            print(f" Document #: {norm_data['metadata'].get('document_number')}")
            print(f" Revision: {norm_data['metadata'].get('revision')}")
            print(f" Equipment Refs: {norm_data['metadata'].get('equipment_references')}")
            print(f"\n Extracted Entities ({len(norm_data.get('entities', []))}):")
            for ent in norm_data.get('entities', [])[:10]:
                print(f"   - [{ent['entity_type']}] {ent['name']} (Confidence: {ent['confidence']})")
            print(f"\n Extracted Topology Relationships ({len(norm_data.get('relationships', []))}):")
            for rel in norm_data.get('relationships', []):
                print(f"   - {rel['source_id']} --({rel['relation_type']})--> {rel['target_id']} (Evidence: {rel.get('evidence')})")
            print(f"\n Extracted Chunks ({len(norm_data.get('chunks', []))}):")
            for chk in norm_data.get('chunks', [])[:3]:
                print(f"   - [{chk['chunk_id']}] {chk['content'][:100]}...")


if __name__ == "__main__":
    target_path = sys.argv[1] if len(sys.argv) > 1 else "samples/sample_pid_drawing.pdf"
    test_upload(target_path)
