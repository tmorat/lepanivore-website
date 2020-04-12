#!/usr/bin/env bash

curl https://clever-tools.cellar.services.clever-cloud.com/releases/latest/clever-tools-latest_linux.tar.gz > clever-tools-latest_linux.tar.gz
tar -xvf clever-tools-latest_linux.tar.gz --strip-components=1

./clever login --token $CLEVER_TOKEN --secret $CLEVER_SECRET
rm -f .clever.json

echo "Deploying backend"
./clever link -a backend_app $BACKEND_APP_ID
./clever deploy -a backend_app -f

echo "Deploying frontend"
./clever link -a frontend_app $FRONTEND_APP_ID
./clever deploy -a frontend_app -f
