#!/usr/bin/env bash
set -e
echo "==> Installing backend dependencies..."
cd backend
npm install --production
echo "==> Dependencies installed successfully!"

