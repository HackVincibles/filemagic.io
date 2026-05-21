#!/usr/bin/env bash
# Purpose: CI-friendly build — engine + API + frontend production bundle.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
mvn -q clean package -DskipTests
cd "$ROOT/frontend"
npm ci
npm run build
echo "Artifacts: backend/target/*.jar and frontend/dist/"
