 (function() {
  'use strict';
  
  function RemoteNotification($http,$window) {
  
    var mobilePlatform = $window.device.platform;
    
    this.updateReminder = function updateReminder( token, studyName, reminder ) {
      
    var api = JSON.parse(localStorage['settings'])[0];
    return $http({
       method:'POST',
       url: api.notificationserver + 'main?registerToken=true&mobilePlatform='+ mobilePlatform + '&token='+ token + '&protocol=' + studyName + '&reminder=' + reminder,
       data: ''
       })
    }
  
  }
  
  function RemoteNotificationFactory($http,$window) {
    return new RemoteNotification($http,$window);
  }
  
  angular.module('redcat.services')
  .factory('remoteNotification',['$http','$window',RemoteNotificationFactory]);
  
  })();
