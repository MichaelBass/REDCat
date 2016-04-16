(function () {
  'use strict';

  function RedCatInitializerController($http,$location,Routes) {

    var self = this;

    this.api = JSON.parse(localStorage['settings'])[0];
    this.studies = [];
    this.redCatInstance = {};


    this.addProtocol = function (){

      cordova.plugins.barcodeScanner.scan(
          function (result) {

            var key2 = CryptoJS.enc.Hex.parse('59b6ab46d379b89d794c87b74a511fbd59b6ab46d379b89d794c87b74a511fbd');
            var iv2  = CryptoJS.enc.Hex.parse('0aaff094b6dc29742cc98a4bac8bc8f9');


            //update the studies with the new protocol
            var loadedProtocols = JSON.parse(localStorage['StudyProtocols']);
            var _protocol = JSON.parse(result.text);

            var cipherParams_redcat_token = CryptoJS.lib.CipherParams.create({ciphertext: CryptoJS.enc.Hex.parse(_protocol.redcat_token.toString())});
            var decrypted_redcat_token = CryptoJS.AES.decrypt(cipherParams_redcat_token, key2, { iv: iv2 });
            _protocol.redcat_token = decrypted_redcat_token.toString(CryptoJS.enc.Utf8);

            var cipherParams_participantID = CryptoJS.lib.CipherParams.create({ciphertext: CryptoJS.enc.Hex.parse(_protocol.participantID.toString())});
            var decrypted_participantID = CryptoJS.AES.decrypt(cipherParams_participantID, key2, { iv: iv2 });
            _protocol.participantID = decrypted_participantID.toString(CryptoJS.enc.Utf8);

            loadedProtocols.push(_protocol); 

            //store local and persistent values
            localStorage['StudyProtocols'] = JSON.stringify(loadedProtocols);
            self.studies = loadedProtocols;// JSON.parse(localStorage['StudyProtocols']);

            //set index to selected protocol
            localStorage['REDCAT_INSTANCE'] = loadedProtocols.length -1;
            self.redCatInstance = _protocol;
            self.getCurrentREDCapContent();
          },
          function (error) {
              //self.message = "Error loading protocol attempting to process QRCode.";
          }
      );
    }

    this.setProtocol = function (event){

      //this.redCatInstance = this.studies[parseInt(event.target.id)];
      //localStorage['REDCAT_INSTANCE'] = JSON.stringify(this.redCatInstance);
      localStorage['REDCAT_INSTANCE'] = parseInt(event.target.id);
      $location.url(Routes.ENGINE_SELECTOR);

    };

    this.resultProtocol = function (event){
      localStorage['REDCAT_INSTANCE'] = parseInt(event.target.id);
      $location.url(Routes.GRAPHS);
    };    

    this.updateProtocol = function (event){

      localStorage['REDCAT_INSTANCE'] = parseInt(event.target.id);
      this.redCatInstance = this.studies[parseInt(event.target.id)];
      //this.message = "Status:Updating Protocol";
      this.getCurrentREDCapContent();
    };

    this.setServerData = function (event){
      //alert("we are here "+ parseInt(event.target.id) + ":" + event.target.checked);
      var loadedProtocols = JSON.parse(localStorage['StudyProtocols']);
      loadedProtocols[parseInt(event.target.id)].ServerData = event.target.checked;
      localStorage['StudyProtocols'] = JSON.stringify(loadedProtocols);
    };

    this.setReminder = function (event){
       var loadedProtocols = JSON.parse(localStorage['StudyProtocols']);
       loadedProtocols[parseInt(event.target.name.substring(0, 1))].Reminder = event.target.id;
       localStorage['StudyProtocols'] = JSON.stringify(loadedProtocols);
    };

    this.removeProtocol = function (event){

      var loadedProtocols = JSON.parse(localStorage['StudyProtocols']);
      var newloadedProtocols = loadedProtocols.splice(parseInt(event.target.id)+1, 1);

      localStorage['StudyProtocols'] = JSON.stringify(newloadedProtocols);
      self.studies = JSON.parse(localStorage['StudyProtocols']);
      $location.url(Routes.REDCAT);

    };

    this.setStudyProtocol = function(){
      var studyprotocol =[];
      var APIInstruments = JSON.parse(localStorage['APIInstruments']);

      for(var j=0; j < self.redCatInstance.uniqueInstruments.length; j++) {
        console.log(self.redCatInstance.uniqueInstruments[j]); 
        if(self.redCatInstance.uniqueInstruments[j] == "assessment_identifier"){
          continue;
        }

        var fFound = false;

        for(var i=0; i < APIInstruments.length; i++) {
          var formattedTitle = APIInstruments[i].Name.replace(' - ','_').replace(/ /g,'_').replace('.','').toLowerCase();
            if(self.redCatInstance.uniqueInstruments[j] == formattedTitle){

              var protocolInstrument = JSON.parse("{\"instrument\":\"" + formattedTitle + "\",\"parameter\":\"" + APIInstruments[i].OID + "\",\"engine\":\"" + Routes.PROMIS + "\"}");
              studyprotocol[studyprotocol.length] = protocolInstrument;
              fFound = true;
              continue;
            }  
        }

        //TODO:Need to reimplement
        if(!fFound){
          //var protocolInstrument = JSON.parse("{\"instrument\":\"" + formattedTitle + "\",\"parameter\":\"\",\"engine\":\"" + Routes.SESSIONS + "\"}");
          //this.studyprotocol[this.studyprotocol.length] = protocolInstrument;         
        }

      }

      self.redCatInstance.studyprotocol = studyprotocol;
      //self.message = self.message + "process instruments\n";
      self.redCatInstance.parameters = [];
      self.getInstrumentParameter();
    }

    this.getInstrumentParameter = function(){

      var oid = self.redCatInstance.studyprotocol[self.redCatInstance.parameters.length].parameter;
      
      $.ajax({
        url: this.api.server + "Calibrations/" + oid + ".json", 
        cache: false, 
        type: 'POST',
        data: '',
        dataType: 'json', 

        beforeSend: function(xhr) {

          //var bytes = Crypto.charenc.Binary.stringToBytes(self.api.userid +":" + self.api.password);
          //var base64 = Crypto.util.bytesToBase64(bytes);
          //xhr.setRequestHeader("Authorization", "Basic " + base64);

          var rawStr = self.api.userid + ":" + self.api.password;
          var wordArray = CryptoJS.enc.Utf8.parse(rawStr);
          var authenticateToken = CryptoJS.enc.Base64.stringify(wordArray);
          xhr.setRequestHeader("Authorization", "Basic " + authenticateToken);
        },

        success: function(data) {
          //console.log(data);
          if(data == "Document is null"){
            self.redCatInstance.parameters[self.redCatInstance.parameters.length] ="";
          }else{
            self.redCatInstance.parameters[self.redCatInstance.parameters.length] = JSON.stringify(data);
          }

          if(self.redCatInstance.studyprotocol.length > self.redCatInstance.parameters.length){
            self.getInstrumentParameter();
            self.message = self.message + "process parameter<br></br>";
          }

          if(self.redCatInstance.studyprotocol.length == self.redCatInstance.parameters.length){
            var loadedProtocols = JSON.parse(localStorage['StudyProtocols']);
            var removedProtocols = loadedProtocols.splice(localStorage['REDCAT_INSTANCE'], 1);
            loadedProtocols.push(self.redCatInstance); 
            localStorage['StudyProtocols'] = JSON.stringify(loadedProtocols);
            self.message = self.message + "parameters done<br></br>";
          }

        },

        error: function(jqXHR, textStatus, errorThrown)
        { 
          console.log(errorThrown);
          self.message = "Error loading protocol attempting to get instrument parameters from " + self.api.server;
        }
      })
    };

    // retrieve all defined measures
    this.getCurrentREDCapContent = function(){

      $.ajax({
            url: this.redCatInstance.redcat_endpoint, 
            cache: false, 
            type: 'POST',
            data: 'token=' + 
                this.redCatInstance.redcat_token + '&content=metadata&format=json&returnFormat=json',
            dataType: 'json', 
            success: function(data) {

                //self.currentInstruments = data;
                
                self.redCatInstance.instrumentset = data;
                
                //self.uniqueInstruments = _.values(_.mapValues(
                //  _.uniqBy(data,'form_name'),'form_name'));
                
                 self.redCatInstance.uniqueInstruments = _.values(_.mapValues(
                  _.uniqBy(data,'form_name'),'form_name'));

                //self.message = self.message + "get REDCAP Protocol \nInstruments :" + self.redCatInstance.uniqueInstruments.length + "\n";
                //self.message = self.message + "Items: " + self.redCatInstance.instrumentset.length + "\n";
           
                self.setStudyProtocol();
            }, 
            error: function(jqXHR, textStatus, errorThrown)
            { 
              console.log(errorThrown);
              //self.message = "Error loading protocol attempting to access REDCap server: " + self.redCatInstance.redcat_endpoint;
            }
      })
    };
 
    if(localStorage['StudyProtocols'] == undefined){
      localStorage['StudyProtocols'] = JSON.stringify([]);
    }
     
    this.studies = JSON.parse(localStorage['StudyProtocols']);
    this.chkbxs = _.mapValues(this.studies,'ServerData','ServerData');
    this.reminder = _.mapValues(this.studies,'Reminder','Reminder'); 

    //console.log($scope);
   // $rootScope.myLog = $sce.trustAsHtml($rootScope.myLog += "<br>Page Loaded");
  }

  angular.module('redcat.controllers')
    .controller('RedCatInitializerController',
    [ '$http','$location', 'Routes', RedCatInitializerController ]);
})();
