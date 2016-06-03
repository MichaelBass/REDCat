(function() {
  'use strict';

  // Wraps Cordova device plugin
  function REDCap($http) {

    this.getProtocol = function(qrCode) {

      var key2 = CryptoJS.enc.Hex.parse('59b6ab46d379b89d794c87b74a511fbd59b6ab46d379b89d794c87b74a511fbd');
      var iv2  = CryptoJS.enc.Hex.parse('0aaff094b6dc29742cc98a4bac8bc8f9');

      var _protocol = JSON.parse(qrCode);

      var cipherParams_redcat_token = CryptoJS.lib.CipherParams.create({ciphertext: CryptoJS.enc.Hex.parse(_protocol.redcat_token.toString())});
      var decrypted_redcat_token = CryptoJS.AES.decrypt(cipherParams_redcat_token, key2, { iv: iv2 });
      _protocol.redcat_token = decrypted_redcat_token.toString(CryptoJS.enc.Utf8);

      var cipherParams_participantID = CryptoJS.lib.CipherParams.create({ciphertext: CryptoJS.enc.Hex.parse(_protocol.participantID.toString())});
      var decrypted_participantID = CryptoJS.AES.decrypt(cipherParams_participantID, key2, { iv: iv2 });
      _protocol.participantID = decrypted_participantID.toString(CryptoJS.enc.Utf8);

      return _protocol
    };

    this.getInstrumentsMetaData = function getInstrumentsMetaData( protocol ) {

      return $http({
        method: "POST",
        url: protocol.redcat_endpoint,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept':'application/json'
        },
        data: 'token=' + protocol.redcat_token + '&content=metadata&format=json&returnFormat=json'
      })

    }

  }

  function REDCapFactory($http) {
    return new REDCap($http);
  }

  angular.module('redcat.services')
     .factory('redcap',['$http',REDCapFactory]);

})();
