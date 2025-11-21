#!/usr/bin/env bash
set -e
echo "==> Installing backend dependencies..."
cd backend
npm ci --production
echo "==> Dependencies installed successfully!"

