(function() {
  'use strict';

  function Resource($http, $window, settingsCache) {
    var RESOURCE_PATH = 'config.json',
        DEFAULT_DEVICE_ID = 'DUMMY-DEVICE';



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
