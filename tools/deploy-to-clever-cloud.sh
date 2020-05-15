#!/usr/bin/env bash

clever login --token $CLEVER_TOKEN --secret $CLEVER_SECRET
rm -f .clever.json

echo "Deploying backend DEV"
clever link -a backend_dev_app $BACKEND_DEV_APP_ID
timeout --signal=SIGINT 360 clever deploy -a backend_dev_app -f || (timeout --signal=SIGINT 120 clever restart -a backend_dev_app || true)

echo "Deploying frontend DEV"
clever link -a frontend_dev_app $FRONTEND_DEV_APP_ID
timeout --signal=SIGINT 360 clever deploy -a frontend_dev_app -f || (timeout --signal=SIGINT 120 clever restart -a frontend_dev_app || true)

if [ -z "$DEPLOY_TO_PROD" ]
then
  echo "\$DEPLOY_TO_PROD is empty, will NOT deploy to prod"
else
  echo "\$DEPLOY_TO_PROD is NOT empty, will now deploy to prod!"

  echo "Deploying backend PROD"
  clever link -a backend_prod_app $BACKEND_PROD_APP_ID
  timeout --signal=SIGINT 360 clever deploy -a backend_prod_app -f || (timeout --signal=SIGINT 120 clever restart -a backend_prod_app || true)

  echo "Deploying frontend PROD"
  clever link -a frontend_prod_app $FRONTEND_PROD_APP_ID
  timeout --signal=SIGINT 360 clever deploy -a frontend_prod_app -f || (timeout --signal=SIGINT 120 clever restart -a frontend_prod_app || true)
fi

# To deploy to prod, trigger a custom build with this YAML custom config:
# env:
#   - DEPLOY_TO_PROD=true
