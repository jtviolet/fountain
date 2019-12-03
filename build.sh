#!/bin/sh

rm -rf node_modules
rm -rf app/client/build
npm install
gulp build
rm -rf node_modules
docker run --rm -v "$PWD":/var/task lambci/lambda:build-nodejs10.x npm install