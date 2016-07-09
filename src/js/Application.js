/* Declare app level module which depends on filters, and services */
(function() {
  'use strict';

  var Application = {
    self: this,

    configure: function configure($routeProvider, Routes) {
      $routeProvider
        .when(Routes.ROOT, {
          templateUrl: 'partials/redcat_initializer.html',
          controller: 'RedCatInitializerController',
          controllerAs: 'redcat'
        })
        .when(Routes.REDCAT, {
          templateUrl: 'partials/redcat_initializer.html',
          controller: 'RedCatInitializerController',
          controllerAs: 'redcat'
        })
        .when(Routes.HOME, {
          templateUrl: 'partials/home.html',
          controller: 'HomeController',
          controllerAs: 'home'
        })
        .when(Routes.GRAPHS, {
          templateUrl: 'partials/graphs.html',
          controller: 'GraphController',
          controllerAs: 'graphs'
        })
        .when(Routes.ENGINE_SELECTOR, {
          templateUrl: 'partials/engine_selector.html',
          controller: 'EngineSelectorController',
          controllerAs: 'engine'
        })
        .when(Routes.PROMIS + '/:index', {
          templateUrl: 'partials/promis.html',
          controller: 'PROMISController',  
        });
    },

    //run: function run($rootScope, $location, $q, $window, settings,
    //                  authenticationTokenCache, Routes, synchronizer,
    //                  deviceCache, device, eventService, sessionQuestionService,
    //                 sessionsService, resourceCache, sessionsCache, settingsCache, sessionAnswerCache) {
    run: function run($sce,$rootScope,$location, $q, $window,settings,
                      Routes,deviceCache,device,resourceCache,settingsCache,protocolsCache) {

      settings.fetch().then(function() {

        // $rootScope.$on('resume', function() {
        //   if (localStorage['REDCAT_INSTANCE'] != undefined){
        //     $location.url(Routes.REDCAT)
        //   }
        //   else{
        //     $location.url(Routes.SESSIONS)
        //   }
        // });
      });
      
      device.persistMetadata();

      /*
      angular.forEach([deviceCache,resourceCache, sessionsCache,
        settingsCache, sessionAnswerCache], function(cache) {
        synchronizer.registerCache(cache);
      });
      synchronizer.run();
      */

      //document.addEventListener('backbutton', eventService.handleBackButton, false);
    }
  };

  angular.module('redcat.constants', []);

  angular.module('redcat.resources',
      ['ngResource', 'redcat.services', 'redcat.constants']);

  angular.module('redcat.controllers',
      ['redcat.constants', 'redcat.resources', 'redcat.services', 'ui.bootstrap']);

  angular.module('redcat.services',
      ['redcat.resources', 'redcat.constants']);

  angular.module('redcat',
      ['ngRoute', 'mobiscroll-datetime', 'redcat.controllers',
        'redcat.resources', 'redcat.services', 'redcat.constants'])

      .config(['$routeProvider', 'Routes', Application.configure])
      //.run(['$rootScope', '$location', '$q', '$window','settings','authenticationTokenCache',
      //  'Routes', 'synchronizer', 'deviceCache', 'device',
      //  'eventService', 'sessionQuestionService', 'sessionsService', 
      //  'resourceCache', 'sessionsCache', 'settingsCache', 'sessionAnswerCache', Application.run]);
      .run(['$sce','$rootScope','$location', '$q', '$window','settings',
        'Routes','deviceCache', 'device','resourceCache','settingsCache','protocolsCache', Application.run]);
})();
