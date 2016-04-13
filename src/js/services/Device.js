(function() {
  'use strict';

  // Wraps Cordova device plugin
  function Device($window, deviceCache, uuid) {
    this.persistMetadata = function() {
      var device = $window.device;
 
      deviceCache.persist({
        id: uuid(),
        type: deviceCache.KEY,
        deviceUuid: device.uuid,
        deviceManufacturer: device.manufacturer,
        deviceModel: device.model,
        devicePlatform: device.platform,
        deviceVersion: device.version
      });
    };
  }

  function DeviceFactory($window, deviceCache, uuid) {
    return new Device($window, deviceCache, uuid);
  }

  angular.module('redcat.services')
         .factory('device', ['$window', 'deviceCache', 'uuid', DeviceFactory]);
})();
