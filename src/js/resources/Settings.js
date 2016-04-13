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
          settingsCache.persist(settingsData);


          if(localStorage['APIInstruments'] == undefined){

            var api = JSON.parse(localStorage['settings'])[0];
            var basicAuthentication = api.userid +":" + api.password;
       
            $.ajax({
              url: api.server + "Forms/.json", 
              cache: false, 
              type: 'POST',
              data: '',
              dataType: 'json', 

              beforeSend: function(xhr) {
                //var bytes = Crypto.charenc.Binary.stringToBytes(basicAuthentication);
                //var base64 = Crypto.util.bytesToBase64(bytes);
                //xhr.setRequestHeader("Authorization", "Basic " + base64);
                var wordArray = CryptoJS.enc.Utf8.parse(basicAuthentication);
                var authenticateToken = CryptoJS.enc.Base64.stringify(wordArray);
                xhr.setRequestHeader("Authorization", "Basic " + authenticateToken);
              },

              success: function(data) {
                localStorage.APIInstruments = JSON.stringify(data.Form);
              }, 
              error: function(jqXHR, textStatus, errorThrown)
              { 
                console.log(errorThrown);
              }
            })

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
