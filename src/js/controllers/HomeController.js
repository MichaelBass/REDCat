(function () {
  'use strict';

  function HomeController($location) {
   this.startSurvey = function(){

        localStorage['AssessmentTimeStamp'] = new Date();
        //var studyprotocol = JSON.parse(localStorage.studyprotocol);
        var study = JSON.parse(localStorage['StudyProtocols'])[localStorage['REDCAT_INSTANCE']];
        var engineSelect = study.studyprotocol[0].engine;
        $location.url(engineSelect + '/0'); 
    }
  }

  angular.module('redcat.controllers')
    .controller('HomeController',
    [ '$location', HomeController]);
})();
