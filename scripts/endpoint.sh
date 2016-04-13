#!/usr/bin/env bash

set -o errexit 


npm_config_env=test 
npm_config_userid=0AD79F70-AB70-4C20-BD01-CA42FEB08F83 
npm_config_password=A4090D3A-6503-4FB8-A8B3-C87E99013B94 
npm_config_server=https://www.assessmentcenter.net/ac_api/2014-01/


echo \{\"environment\":\"$npm_config_env\",\"server\":\"$npm_config_server\",\"userid\":\"$npm_config_userid\",\"password\":\"$npm_config_password\"\} > src/config.json
##sed s%ACCESS_ORIGIN%$npm_config_server%g config > config.xml