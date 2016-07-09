(function() {
  'use strict';

  // Wraps Cordova device plugin
  function RemoteNotification($http, device) {

    this.updateReminder = function updateReminder( token, studyName, reminder ) {

      var mobilePlatform = 'iOS';
      if (device.platform == 'android' || device.platform == 'Android' || device.platform == 'amazon-fireos' ) {
          mobilePlatform = 'android';
      }
      var api = JSON.parse(localStorage['settings'])[0];
      return $http({
        method:'POST',
        url: api.notificationserver + 'main?registerToken=true&mobilePlatform='+ mobilePlatform + '&token='+ token + '&protocol=' + studyName + '&reminder=' + reminder, 
        data: ''
        })
    }

  }

  function RemoteNotificationFactory($http, device) {
    return new RemoteNotification($http, device);
  }

  angular.module('redcat.services')
     .factory('remoteNotification',['$http','device',RemoteNotificationFactory]);

})();
