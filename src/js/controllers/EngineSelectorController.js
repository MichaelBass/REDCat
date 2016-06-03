(function () {
  'use strict';

  function EngineSelectorController($http, $location,$rootScope,$scope,$routeParams,protocolsCache, Routes) {

    var self = this;

    $scope.index = $routeParams.id | 0;
    $rootScope.myLog =  $sce.trustAsHtml("");

    $scope.startAssessment = function(index){

      localStorage['AssessmentTimeStamp'] = new Date();

      if(localStorage['REDCAT_INSTANCE'] == null){
        $rootScope.myLog = $sce.trustAsHtml("No protocol selected.");
      }

      if(localStorage['protocols'] == null){
        $rootScope.myLog = $sce.trustAsHtml("Error in loaded protocol.");
      }
      
      var study  = protocolsCache.fetch(parseInt(localStorage['REDCAT_INSTANCE']));

      if(study == null){
        $rootScope.myLog = $sce.trustAsHtml("Error in accessing protocol."); 
      }

      var engineSelect = study.studyprotocol[$scope.index].engine;
      if(engineSelect  == null){
        $rootScope.myLog = $sce.trustAsHtml("Error in determining protocol engine.");
      }

      $location.url(engineSelect + '/' + $scope.index); 

    }

  }

  angular.module('redcat.controllers')
    .controller('EngineSelectorController',
    [ '$http','$location','$rootScope','$scope','$routeParams','protocolsCache','Routes',EngineSelectorController ]);
})();
