(function () {
  'use strict';

  function HomeController($location,$scope,protocolsCache) {
   $scope.startSurvey = function(){

        localStorage['AssessmentTimeStamp'] = new Date();
        //var studyprotocol = JSON.parse(localStorage.studyprotocol);
        var study  = protocolsCache.fetch(parseInt(localStorage['REDCAT_INSTANCE']));
        var engineSelect = study.studyprotocol[0].engine;
        $location.url(engineSelect + '/0'); 
    }
  }

  angular.module('redcat.controllers')
    .controller('HomeController',
    [ '$location','$scope','protocolsCache', HomeController]);
})();
