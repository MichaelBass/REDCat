#!/usr/bin/env bash

set -o errexit 


npm_config_env=test 
npm_config_userid=2F984419-5008-4E42-8210-68592B418233
npm_config_password=21A673E8-9498-4DC2-AAB6-07395029A778
npm_config_server=http://msswebtest.fsm.northwestern.edu/assessmentcenter/qa/ac_api/2014-01/

npm_config_notificationkey=268578571335 
npm_config_notificationserver=https://default-demo-app-25d1e.appspot.com/

npm_config_key2=59b6ab46d379b89d794c87b74a511fbd59b6ab46d379b89d794c87b74a511fbd
npm_config_iv2=0aaff094b6dc29742cc98a4bac8bc8f9

echo \{\"id\":\"1\",\"environment\":\"$npm_config_env\",\"server\":\"$npm_config_server\",\"userid\":\"$npm_config_userid\",\"password\":\"$npm_config_password\",\"notificationserver\":\"$npm_config_notificationserver\",\"notificationkey\":\"$npm_config_notificationkey\",\"key2\":\"$npm_config_key2\",\"iv2\":\"$npm_config_iv2\"\} > src/config.json
##sed s%ACCESS_ORIGIN%$npm_config_server%g config > config.xml