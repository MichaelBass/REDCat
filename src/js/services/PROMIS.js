(function() {
  'use strict';

  // Wraps Cordova device plugin
  function PROMISAPI($http) {


    this.getInstrumentParameter = function getInstrumentParameter( formOID ) {

      var api = JSON.parse(localStorage['settings'])[0];
      var basicAuthentication = api.userid +":" + api.password;
      var wordArray = CryptoJS.enc.Utf8.parse(basicAuthentication);
      var authenticateToken = CryptoJS.enc.Base64.stringify(wordArray);

      return $http({
        method:'POST',
        url: api.server + "Calibrations/" + formOID + ".json", 
        headers: {
          'Authorization': "Basic " + authenticateToken
        },
        data: {}
        })
    }

  }

  function PROMISAPIFactory($http) {
    return new PROMISAPI($http);
  }

  angular.module('redcat.services')
     .factory('promisapi',['$http',PROMISAPIFactory]);

})();
