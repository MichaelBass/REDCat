(function () {
  'use strict';

  function EngineSelectorController($http, $location, $routeParams, Routes) {

    var self = this;

    this.index = $routeParams.id | 0;
    this.message = "Status:";

    this.startAssessment = function(index){

      localStorage['AssessmentTimeStamp'] = new Date();

      if(localStorage['REDCAT_INSTANCE'] == null){
        self.message = "No protocol selected.";
      }

      if(localStorage['StudyProtocols'] == null){
        self.message = "Error in loaded protocols";
      }

      var study = JSON.parse(localStorage['StudyProtocols'])[localStorage['REDCAT_INSTANCE']];

      if(study == null){
        self.message = "Error in accessing protocol";
      }

      var engineSelect = study.studyprotocol[this.index].engine;
      if(engineSelect  == null){
        self.message = "Error in determining protocol engine.";
      }

      $location.url(engineSelect + '/' + index); 

    }

  }

  angular.module('redcat.controllers')
    .controller('EngineSelectorController',
    [ '$http','$location', '$routeParams', 'Routes', EngineSelectorController ]);
})();
