#!/usr/bin/env bash

set -o errexit 


echo "--- recreate platforms ---"

#./node_modules/.bin/cordova platform remove ios; 
#./node_modules/.bin/cordova platform add ios@4.1.0;
#./node_modules/.bin/cordova platform remove android; 
#./node_modules/.bin/cordova platform add android@5.0.0;
./node_modules/.bin/cordova platform remove browser; 
./node_modules/.bin/cordova platform add browser;
