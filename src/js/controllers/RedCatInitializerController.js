(function () {
  'use strict';

  function RedCatInitializerController($http,$location,$rootScope,$scope,redcap,promisapi,remoteNotification,protocolsCache,settingsCache,settings,Routes) {

    var self = this;

    $scope.studies = protocolsCache.fetchAll();
    $scope.key = -1;
    localStorage['REDCAT_INSTANCE'] = -1;

    $scope.getServerSettings = function(){
      var rtn = 1.00;
      if(settingsCache.first().server_version != undefined){
        console.log(settingsCache.first());
        rtn = settingsCache.first().server_version;
      }
      return rtn;
    };
  
    $scope.updateServerSettings = function(){

      settings.update();

    }

    $scope.addProtocol = function (){

      cordova.plugins.barcodeScanner.scan(
          function (result) {
            $rootScope.loading = true;
            
            if( $scope.studies.length == 0){
              $scope.key = $scope.studies.length;
            }else{
                $scope.key = -1;
                var usedIds = _.values(_.mapValues(_.uniqBy($scope.studies,'id'),'id'));
                
                for(var i=0; i < usedIds.length;i++){
                  if(parseInt(usedIds[i]) >= $scope.key){
                      $scope.key = parseInt(usedIds[i]);
                  }
                }
                $scope.key += 1;

            }

            
            $scope.redCatInstance = redcap.getProtocol(result.text);
            $scope.redCatInstance.id = $scope.key;
            localStorage['REDCAT_INSTANCE'] = $scope.key;
            //$rootScope.myLog =  $sce.trustAsHtml($rootScope.myLog +  "addProtocol" + "<br/>");            
            $scope.getCurrentREDCapContent();
          },
          function (error) {
            $rootScope.loading = false;
          }
      );
    }

    $scope.setProtocol = function (event){
      localStorage['REDCAT_INSTANCE'] = parseInt(event.target.id);
      $location.url(Routes.ENGINE_SELECTOR);
    };

    $scope.resultProtocol = function (event){
      localStorage['REDCAT_INSTANCE'] = parseInt(event.target.id);
      $location.url(Routes.GRAPHS);
    };    

    $scope.updateProtocol = function (event){
      $rootScope.loading = true;

      localStorage['REDCAT_INSTANCE'] = parseInt(event.target.id);
      $scope.key = parseInt(event.target.id);
      $scope.redCatInstance = protocolsCache.fetch($scope.key);

      //reset notification and data server
      var api = settingsCache.first();
      $scope.setNotification(api.registerToken, $scope.redCatInstance.name, 0);
      $scope.redCatInstance.Reminder="";
      $scope.redCatInstance.ServerData = false;
      protocolsCache.persistItem($scope.redCatInstance);
      //$scope.chkbxs = _.mapValues($scope.studies,'ServerData','ServerData');
      //$scope.reminder = _.mapValues($scope.studies,'Reminder','Reminder');



      $scope.getCurrentREDCapContent();


      //$rootScope.myLog =  $sce.trustAsHtml($rootScope.myLog +  "updating protocol : " +  $scope.key + "<br/>");

    };

    $scope.setServerData = function (event){

      localStorage['REDCAT_INSTANCE'] = parseInt(event.target.id);
      $scope.key = parseInt(event.target.id);

      $scope.redCatInstance = protocolsCache.fetch($scope.key);
      $scope.redCatInstance.ServerData = event.target.checked;
      protocolsCache.persistItem($scope.redCatInstance);

    };

    $scope.setNotification = function (token, studyName, reminder){

      if(token != undefined){
        var promis = remoteNotification.updateReminder(token, studyName, reminder);
        promis.then(
          function(response){
            //$rootScope.myLog =  $sce.trustAsHtml(response + "<br/>");
          },
          function(error){
            alert(error);
          }
        );
      }

    }

    $scope.setReminder = function (event){

      var key = event.target.name.substring(0, event.target.name.length - 8);// parse out reminder suffix
      var api = settingsCache.first();
      localStorage['REDCAT_INSTANCE'] = parseInt(key);
      $scope.key = parseInt(key);

      $scope.redCatInstance = protocolsCache.fetch($scope.key);
      $scope.redCatInstance.Reminder = event.target.id;
      protocolsCache.persistItem($scope.redCatInstance);

      var _reminder = 0;
      var token = api.registerToken;
      
      var studyName = $scope.redCatInstance.name;

      if(event.target.id =="daily"){
        _reminder = 1;
      }
      if(event.target.id =="weekly"){
        _reminder = 7;
      }

      $scope.setNotification(token, studyName, _reminder);

    };

    $scope.removeProtocol = function (event){

      var api = settingsCache.first();
      $scope.redCatInstance = protocolsCache.fetch(parseInt(event.target.id));
      $scope.setNotification(api.registerToken, $scope.redCatInstance.name, 0);
      $scope.redCatInstance.Reminder="";
      $scope.redCatInstance.ServerData = false;
      //$scope.chkbxs = _.mapValues($scope.studies,'ServerData','ServerData');
      //$scope.reminder = _.mapValues($scope.studies,'Reminder','Reminder');

      protocolsCache.destroyItem(parseInt(event.target.id));
      $scope.studies = protocolsCache.fetchAll();

      $scope.key = -1;
      localStorage['REDCAT_INSTANCE'] = -1;

    };

    $scope.setStudyProtocol = function(){

      $scope.redCatInstance.studyprotocol =[];
      $scope.redCatInstance.parameters = [];

      var APIInstruments = JSON.parse(localStorage['APIInstruments']);


      //Hack to store data in session when done loading.
      var InstrumentProcessCounter = 0;

      for(var j=0; j < $scope.redCatInstance.uniqueInstruments.length; j++) {

        //$rootScope.myLog =  $sce.trustAsHtml($rootScope.myLog + $scope.redCatInstance.uniqueInstruments[j] + "<br/>");

        if($scope.redCatInstance.uniqueInstruments[j] == "assessment_identifier"){
          continue;
        }

        var fFound = false;

        for(var i=0; i < APIInstruments.length; i++) {
          var formattedTitle = APIInstruments[i].Name.replace(' - ','_').replace(/ /g,'_').replace('.','').toLowerCase();
            if($scope.redCatInstance.uniqueInstruments[j] == formattedTitle){

              var protocolInstrument = {
                  instrument:formattedTitle,
                  parameter:APIInstruments[i].OID,
                  engine: Routes.PROMIS
              };
              
              $scope.redCatInstance.studyprotocol.push(protocolInstrument);
              fFound = true;

              var promis = promisapi.getInstrumentParameter(APIInstruments[i].OID)
              
              promis.then(
                function(calibration){

                 // $rootScope.myLog =  $sce.trustAsHtml($rootScope.myLog +  "getInstrumentParameter::" + formattedTitle + "<br/>");
                  //console.log(calibration)
                  if(calibration.data == "Document is null"){
                    $scope.redCatInstance.parameters.push("");
                  }else{
                    $scope.redCatInstance.parameters.push(JSON.stringify(calibration.data));
                  }
                  InstrumentProcessCounter += 1;

                  if(InstrumentProcessCounter == $scope.redCatInstance.uniqueInstruments.length){
                    $scope.persistToStorage();
                  }

                },
                function(error){
                  alert(error);
                }
              );

              continue;
            }  
        }

        //TODO:Need to reimplement (for non PROMIS instruments)
        if(!fFound){
          //var protocolInstrument = JSON.parse("{\"instrument\":\"" + formattedTitle + "\",\"parameter\":\"\",\"engine\":\"" + Routes.SESSIONS + "\"}");
          //this.studyprotocol[this.studyprotocol.length] = protocolInstrument;         
        }

      }

    }

    $scope.persistToStorage = function(){

      protocolsCache.persistItem($scope.redCatInstance);
      $scope.studies = protocolsCache.fetchAll();

      $scope.redCatInstance = protocolsCache.fetch($scope.key);
      localStorage['REDCAT_INSTANCE'] = $scope.key;

      //$rootScope.myLog =  $sce.trustAsHtml("Done persisting protocol : " + $scope.redCatInstance.id  + "<br/>");
      $rootScope.loading = false;

    }

    // retrieve all defined measures
    $scope.getCurrentREDCapContent = function(){

      var promis = redcap.getInstrumentsMetaData($scope.redCatInstance);
      promis.then(
        function(instruments){

          $scope.redCatInstance.instrumentset = instruments.data;
          $scope.redCatInstance.uniqueInstruments = _.values(_.mapValues(_.uniqBy(instruments.data,'form_name'),'form_name'));
          //$rootScope.myLog =  $sce.trustAsHtml($rootScope.myLog +  "getCurrentREDCapContent" + "<br/>");
          $scope.setStudyProtocol();
          
        },
        function(error){
          alert('AJAX call is async!');
        }
      );

    };

    $scope.chkbxs = _.mapValues($scope.studies,'ServerData','ServerData');
    $scope.reminder = _.mapValues($scope.studies,'Reminder','Reminder'); 
    $scope.ServerSettings = $scope.getServerSettings();
  }

  angular.module('redcat.controllers')
    .controller('RedCatInitializerController',
    [ '$http','$location','$rootScope','$scope','redcap','promisapi','remoteNotification','protocolsCache','settingsCache','settings','Routes', RedCatInitializerController ]);
})();
