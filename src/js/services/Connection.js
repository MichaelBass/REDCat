(function() {
  'use strict';

  // Wraps the Cordova Network Information Plugin
  function Connection($window) {
    this.hasConnection = function() {
      var connection = $window.navigator.connection;
      return connection.type !== $window.Connection.NONE;
    };
  }

  function ConnectionFactory($window) {
    return new Connection($window);
  }

  angular.module('redcat.services')
         .factory('connection', ['$window', ConnectionFactory]);
})();
