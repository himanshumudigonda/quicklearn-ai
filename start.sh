#!/usr/bin/env bash
set -e
echo "==> Starting QuickLearn AI Backend..."
cd backend
exec node src/server.js

