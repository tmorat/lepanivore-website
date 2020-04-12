#!/usr/bin/env bash

clever login --token $CLEVER_TOKEN --secret $CLEVER_SECRET
rm -f .clever.json

echo "Deploying backend"
clever link -a backend_app $BACKEND_APP_ID
clever deploy -a backend_app -f

echo "Deploying frontend"
clever link -a frontend_app $FRONTEND_APP_ID
clever deploy -a frontend_app -f
