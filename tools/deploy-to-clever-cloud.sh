#!/usr/bin/env bash

clever login --token $CLEVER_TOKEN --secret $CLEVER_SECRET
rm -f .clever.json

echo "Deploying backend"
clever link -a backend_app $BACKEND_APP_ID
timeout --signal=SIGINT 360 clever deploy -a backend_app -f || (timeout --signal=SIGINT 120 clever restart -a backend_app || true)

echo "Deploying frontend"
clever link -a frontend_app $FRONTEND_APP_ID
timeout --signal=SIGINT 360 clever deploy -a frontend_app -f || (timeout --signal=SIGINT 120 clever restart -a frontend_app || true)
