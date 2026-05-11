#!/bin/bash

cd /var/www/html/timeflow-prod-landingpage || cd /var/www/html/timeflow-stage-landingpage
git fetch -a
git stash
git pull
npm i && npm run build
pm2 restart landing-page || pm2 start npm --name "landing-page" -- run start
