import os
import sys
import time
import signal
import socket
import subprocess
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent

# Load .env file
env_file = ROOT_DIR / ".env"
if env_file.exists():
    with open(env_file, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, val = line.split("=", 1)
                os.environ[key.strip()] = val.strip()

# Ensure Database URLs are propagated if not specifically set
db_url = os.environ.get("DATABASE_URL", "")
if db_url:
    os.environ.setdefault("AUTH_DATABASE_URL", db_url)
    os.environ.setdefault("NOTIFICATION_DATABASE_URL", db_url)
    os.environ.setdefault("ASSISTANT_DATABASE_URL", db_url)

PYTHON_EXE = (
    "C:\\Users\\musaq\\AppData\\Local\\Programs\\Python\\Python312\\python.exe"
    if os.path.exists("C:\\Users\\musaq\\AppData\\Local\\Programs\\Python\\Python312\\python.exe")
    else sys.executable
)

SERVICES = [
    {
        "name": "Retrieval & Semantic Search Service",
        "dir": ROOT_DIR / "services" / "retrievel-service",
        "port": 8001,
    },
    {
        "name": "Industrial AI Reasoning Service",
        "dir": ROOT_DIR / "services" / "reasoning-service",
        "port": 8002,
    },
    {
        "name": "Document Ingestion Intelligence Service",
        "dir": ROOT_DIR / "services" / "Ingestion-service",
        "port": 8003,
    },
    {
        "name": "Knowledge Graph & Asset Service",
        "dir": ROOT_DIR / "services" / "knowledge-service",
        "port": 8005,
    },
    {
        "name": "Safety Compliance & Audit Service",
        "dir": ROOT_DIR / "services" / "compliance-service",
        "port": 8006,
    },
    {
        "name": "Predictive Maintenance Service",
        "dir": ROOT_DIR / "services" / "maintenance-service",
        "port": 8007,
    },
    {
        "name": "Identity & Access Auth Service (WorkOS Dual Auth)",
        "dir": ROOT_DIR / "shared" / "auth",
        "port": 8008,
    },
    {
        "name": "Real-Time Notification Service",
        "dir": ROOT_DIR / "shared" / "notification-service",
        "port": 8009,
    },
    {
        "name": "Workforce AI Assistant Service",
        "dir": ROOT_DIR / "services" / "assistant-service",
        "port": 8010,
    },
    {
        "name": "Central API Gateway",
        "dir": ROOT_DIR / "gateway",
        "port": 8000,
    },
]

def is_port_open(port: int, host: str = "127.0.0.1") -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        return s.connect_ex((host, port)) == 0

def main():
    print("=" * 70)
    print("  Axios.ai — Microservice Orchestration Manager")
    print("=" * 70)

    processes = []

    def shutdown(signum=None, frame=None):
        print("\nStopping all services...")
        for p, svc in processes:
            try:
                p.terminate()
            except Exception:
                pass
        time.sleep(1)
        for p, svc in processes:
            try:
                p.kill()
            except Exception:
                pass
        print("All services stopped.")
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    logs_dir = ROOT_DIR / "logs"
    logs_dir.mkdir(exist_ok=True)

    # Launch each backend microservice
    for svc in SERVICES:
        name = svc["name"]
        cwd = svc["dir"]
        port = svc["port"]
        slug = f"port_{port}"
        svc["log_file"] = logs_dir / f"{slug}.log"

        if is_port_open(port):
            print(f"[*] Port {port} ({name}) is already listening.")
            continue

        print(f"[+] Starting {name} on port {port}...")
        cmd = [
            PYTHON_EXE,
            "-m",
            "uvicorn",
            "app.main:app",
            "--host",
            "0.0.0.0",
            "--port",
            str(port),
        ]
        
        log_f = open(svc["log_file"], "w", encoding="utf-8")
        svc_env = os.environ.copy()
        svc_env["PYTHONPATH"] = f"{ROOT_DIR};{cwd};{svc_env.get('PYTHONPATH', '')}"
        proc = subprocess.Popen(
            cmd,
            cwd=str(cwd),
            env=svc_env,
            stdout=log_f,
            stderr=log_f,
        )
        processes.append((proc, svc))

    # Check & launch frontend on port 3000
    if not is_port_open(3000):
        print("[+] Starting Web Client Frontend on port 3000...")
        client_dir = ROOT_DIR / "client"
        client_log = open(logs_dir / "port_3000.log", "w", encoding="utf-8")
        client_proc = subprocess.Popen(
            "npm run dev",
            cwd=str(client_dir),
            shell=True,
            env=os.environ.copy(),
            stdout=client_log,
            stderr=client_log,
        )
        processes.append((client_proc, {"name": "Web Client Frontend", "dir": client_dir, "port": 3000, "is_npm": True, "log_file": logs_dir / "port_3000.log"}))
    else:
        print("[*] Port 3000 (Web Client Frontend) is already listening.")

    # Wait for services to initialize
    print("\nWaiting for services to initialize...")
    for _ in range(15):
        all_ready = all(is_port_open(svc["port"]) for svc in SERVICES)
        if all_ready:
            break
        time.sleep(1)

    # Check status
    print("\n" + "=" * 70)
    print(f"{'PORT':<8} {'SERVICE NAME':<45} {'STATUS'}")
    print("-" * 70)
    
    # Also check frontend on port 3000
    client_status = "ONLINE (Listening)" if is_port_open(3000) else "OFFLINE"
    print(f"{'3000':<8} {'Web Client Frontend':<45} {client_status}")

    for svc in SERVICES:
        port = svc["port"]
        name = svc["name"]
        status = "ONLINE (Listening)" if is_port_open(port) else "STARTING / OFFLINE"
        print(f"{port:<8} {name:<45} {status}")

    print("=" * 70)
    print("All backend services and API Gateway are running in background.")
    print("Press Ctrl+C to stop all services.")

    # Keep alive and monitor
    while True:
        time.sleep(5)
        for p, svc in list(processes):
            poll = p.poll()
            if poll is not None:
                print(f"[!] Warning: {svc['name']} (Port {svc['port']}) exited with code {poll}. Restarting...")
                if svc.get("is_npm"):
                    cmd = "npm run dev"
                    shell = True
                else:
                    cmd = [
                        PYTHON_EXE,
                        "-m",
                        "uvicorn",
                        "app.main:app",
                        "--host",
                        "0.0.0.0",
                        "--port",
                        str(svc["port"]),
                    ]
                    shell = False
                log_f = open(svc.get("log_file", logs_dir / f"port_{svc['port']}.log"), "a", encoding="utf-8")
                svc_env = os.environ.copy()
                svc_env["PYTHONPATH"] = f"{ROOT_DIR};{svc['dir']};{svc_env.get('PYTHONPATH', '')}"
                new_p = subprocess.Popen(
                    cmd,
                    cwd=str(svc["dir"]),
                    shell=shell,
                    env=svc_env,
                    stdout=log_f,
                    stderr=log_f,
                )
                processes.remove((p, svc))
                processes.append((new_p, svc))

if __name__ == "__main__":
    main()
