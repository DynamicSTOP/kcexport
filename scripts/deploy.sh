#!/bin/bash
if [ $1 -eq "production" ]; then
    AWS_CF_DOMAIN="export.kc3.moe";
    AWS_CF_DISTRIBUTION_ID="E1YNMJPENI6H1S"
elif [ $1 -eq "dev" ]; then
    AWS_CF_DOMAIN="export.kc-db.info";
    AWS_CF_DISTRIBUTION_ID="E1HL82941ZQTFJ"
fi

find dist -name "*.png" -exec optipng {} \;
aws s3 sync ./dist/ s3://${AWS_CF_DOMAIN} --acl public-read --metadata-directive REPLACE --cache-control public,max-age=5184000 --exclude "index.html" --delete
aws s3 cp ./dist/index.html s3://${AWS_CF_DOMAIN}/index.html --acl public-read --metadata-directive REPLACE --cache-control public,max-age=3600
aws cloudfront create-invalidation --distribution-id=${AWS_CF_DISTRIBUTION_ID} --paths /index.html