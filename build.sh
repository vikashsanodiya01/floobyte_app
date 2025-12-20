#!/usr/bin/env bash
set -euo pipefail

echo "Cleaning previous builds..."
rm -rf dist build-artifact.zip || true

echo "Installing dependencies..."
npm ci

echo "Building client and server..."
npm run build

echo "Creating deployment artifact..."
zip -r build-artifact.zip dist package.json package-lock.json .env.example >/dev/null

echo "Build complete. Artifact: build-artifact.zip"

