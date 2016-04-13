(function() {
  'use strict';

  var Routes = {
    ROOT: '/',
    HOME: '/home',
    REDCAT: '/redcat_initializer',
    ENGINE_SELECTOR: '/engine_selector',
    PROMIS : '/promis',
    GRAPHS : '/graphs'
  };

  angular.module('redcat.constants')
         .constant('Routes', Routes);
})();
