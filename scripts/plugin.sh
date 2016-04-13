#!/usr/bin/env bash

set -o errexit 


if [  -d plugins/phonegap-plugin-barcodescanner ]; then
    ./node_modules/.bin/cordova plugin remove phonegap-plugin-barcodescanner;
fi
./node_modules/.bin/cordova plugin add phonegap-plugin-barcodescanner;


if [  -d plugins/cordova-plugin-network-information ]; then
	./node_modules/.bin/cordova plugin remove cordova-plugin-network-information;
fi
./node_modules/.bin/cordova plugin add cordova-plugin-network-information;


if [  -d plugins/cordova-plugin-pushplugin ]; then
	./node_modules/.bin/cordova plugin remove cordova-plugin-pushplugin;
fi
./node_modules/.bin/cordova plugin add cordova-plugin-pushplugin;

## dependancy from pushplugin
##./node_modules/.bin/cordova plugin remove cordova-plugin-device; 
##./node_modules/.bin/cordova plugin add cordova-plugin-device; 

 

