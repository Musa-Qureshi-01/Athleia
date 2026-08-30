# Axios.ai — Monolith Docker Container
# All 10 microservices + API Gateway in a single container.
# supervisord manages all processes; only port 8000 (gateway) is exposed.
# Internal services communicate on localhost — services.yaml works as-is.

FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# ── System dependencies + supervisord ─────────────────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# ── Copy all service source code ───────────────────────────────────────────
COPY gateway/                                             ./gateway/
COPY shared/authenticaion/                                ./shared/authenticaion/
COPY shared/notification-service/                         ./shared/notification-service/
COPY services/assistant-service/                          ./services/assistant-service/
COPY "services/semantic-serach-(retrievel)-service/"      "./services/semantic-serach-(retrievel)-service/"
COPY services/reasoning-service/                          ./services/reasoning-service/
COPY services/Ingestion-service/                          ./services/Ingestion-service/
COPY services/knowledge-service/                          ./services/knowledge-service/
COPY services/compliance-service/                         ./services/compliance-service/
COPY services/maintenance-service/                        ./services/maintenance-service/

# ── Install all dependencies ───────────────────────────────────────────────
# Services with requirements.txt
RUN pip install --no-cache-dir -r gateway/requirements.txt
RUN pip install --no-cache-dir -r services/assistant-service/requirements.txt
RUN pip install --no-cache-dir -r "services/semantic-serach-(retrievel)-service/requirements.txt"
RUN pip install --no-cache-dir -r services/reasoning-service/requirements.txt
RUN pip install --no-cache-dir -r services/Ingestion-service/requirements.txt
RUN pip install --no-cache-dir -r services/knowledge-service/requirements.txt
RUN pip install --no-cache-dir -r services/compliance-service/requirements.txt

# Services with pyproject.toml (installed as editable packages)
RUN pip install --no-cache-dir -e shared/authenticaion/
RUN pip install --no-cache-dir -e shared/notification-service/
RUN pip install --no-cache-dir -e services/maintenance-service/

# ── supervisord config ─────────────────────────────────────────────────────
COPY infra/supervisord.conf /etc/supervisor/conf.d/axios.conf

# Create log directory
RUN mkdir -p /var/log/supervisor

# ── Only the gateway port is public-facing ─────────────────────────────────
EXPOSE 8000

CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/supervisord.conf"]
