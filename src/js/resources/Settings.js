(function() {
  'use strict';

  function Resource($http, $window, settingsCache) {
    var RESOURCE_PATH = 'config.json',
        DEFAULT_DEVICE_ID = 'DUMMY-DEVICE',
        SERVER_RESOURCE_PATH ='http://default-demo-app-25d1e.appspot.com/settings';


    this.update = function update(){

      var api = settingsCache.first();

      $http({
        method:'POST',
        url: SERVER_RESOURCE_PATH,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept':'application/json'
        }, 
        data: 'token=' + api.registerToken 
        }).then(function successCallback(response) {
          //console.log(response.data);

          var api = settingsCache.first();
          api.server_version = response.data.server_version;
          api.environment = response.data.environment;
          api.server = response.data.server;
          api.id = response.data.id;
          api.iv2 = response.data.iv2;
          api.key2 = response.data.key2;
          api.notificationkey = response.data.notificationkey;
          api.notificationserver = response.data.notificationserver;
          api.password = response.data.password;
          api.userid = response.data.userid;

          settingsCache.persistItem(api);

        },function errorCallback(response) {
          alert(response);
        }); 



      //console.log($http.get(SERVER_RESOURCE_PATH + api.registerToken));

    } 


    this.fetch = function fetch() {

      return $http.get(RESOURCE_PATH)
        .then(function(settings) {

          var settingsData = angular.copy(settings.data);
          // '$window.device.uuid' dependent on Cordova device plugin
          settingsData.clientUuid = $window.device.uuid || DEFAULT_DEVICE_ID;

          //settingsCache.persist(settingsData);
          settingsCache.persistItem(settingsData);

          if(localStorage['APIInstruments'] == undefined){

            var api = JSON.parse(localStorage['settings'])[0];
            var basicAuthentication = api.userid +":" + api.password;
            var wordArray = CryptoJS.enc.Utf8.parse(basicAuthentication);
            var authenticateToken = CryptoJS.enc.Base64.stringify(wordArray);

            $http({
              method:'POST',
              url: api.server + "Forms/.json", 
              headers: {
                'Authorization': "Basic " + authenticateToken
              },
              data: {}
              }).then(function successCallback(response) {
                localStorage.APIInstruments = JSON.stringify(response.data.Form);
              },function errorCallback(response) {
                console.log(response);
              }); 
          }


        });
    };

  }

  function Settings($http, $window, settingsCache) {
    return new Resource($http, $window, settingsCache);
  }

  angular.module('redcat.resources')
    .factory('settings', ['$http', '$window', 'settingsCache', Settings]);
})();
