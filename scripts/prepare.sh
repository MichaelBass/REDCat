#!/usr/bin/env bash

set -o errexit 

echo "verify config file exists"
if [ ! -f src/config.json ]; then
    echo "--- missing src/config.json ---"
    exit
fi

echo "remove www dir"
rm -rf www && mkdir -p www/js www/css

echo "eslint before copying"
./node_modules/.bin/eslint src

echo "copy src files to www"
cp src/redcat.gif www/
cp src/ajax-loader.gif www/
cp src/redcat.ico www/
cp src/index.html www/
cp -r src/js/* www/js/
cp -r src/css/* www/css/
cp ./node_modules/angular/angular.min.js www/js/ 
cp ./node_modules/angular-route/angular-route.min.js www/js/
cp ./node_modules/angular-resource/angular-resource.min.js www/js/
mkdir -p www/partials/
cp -r src/partials/* www/partials/
mkdir -p www/vendor/css/
cp -r src/vendor/css/* www/vendor/css/
mkdir -p www/vendor/js/
cp -r src/vendor/js/* www/vendor/js/ 
mkdir -p www/vendor/css/font-awesome/fonts
cp -r ./node_modules/font-awesome/fonts/* www/vendor/css/font-awesome/fonts
mkdir -p www/vendor/css/font-awesome/css
cp ./node_modules/font-awesome/css/font-awesome.min.css www/vendor/css/font-awesome/css
cp ./node_modules/moment/moment.js www/js/
cp ./src/config.json ./www/config.json
mkdir -p www/vendor/font/
cp -r src/vendor/font/* www/vendor/font/
mkdir -p www/vendor/fonts/
cp -r src/vendor/fonts/* www/vendor/fonts/ 