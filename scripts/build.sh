#!/usr/bin/env bash

set -o errexit 

echo "run prepare script"
./scripts/endpoint.sh;
./scripts/prepare.sh;
./scripts/platform.sh;
./scripts/plugin.sh;

## TODO  Fix line: /Users/mbb411/Documents/Development/cbitstech/interro_new/platforms/ios/REDCat/Plugins/cordova-plugin-pushplugin/PushPlugin.m:365:19
##[self.webViewEngine evaluateJavaScript:jsCallBack completionHandler:nil];
./node_modules/.bin/cordova build browser;
./node_modules/.bin/cordova build android;
./node_modules/.bin/cordova build ios;
