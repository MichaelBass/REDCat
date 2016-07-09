(function() {
  'use strict';

  function GraphController(protocolsCache) {

    var mydata =[];
    //var loadedProtocols = JSON.parse(localStorage['StudyProtocols']);
    
    var study  = protocolsCache.fetch(parseInt(localStorage['REDCAT_INSTANCE']));
    
    if (study == null){
        return;
    }

    //if(loadedProtocols[localStorage['REDCAT_INSTANCE']].graphPoints == undefined){
    if(study.graphPoints == null || study.graphPoints == undefined){    
        return;
    }

    var assessments = study.graphPoints;// loadedProtocols[localStorage['REDCAT_INSTANCE']].graphPoints;
    var series = _.map(_.uniqBy(assessments,'instrument'),'instrument');

    for(var i=0; i < series.length; i++){
        //console.log( series[i] );
        var series_data = _.map(_.filter(assessments, { 'instrument': series[i]}),'tscore');
        //console.log( series_data);
        var seriesline = new Object();
        seriesline.name = series[i];
        seriesline.data = series_data

        mydata.push(seriesline);
    }
   
     $('#highcharts-history').highcharts({
        title: {
            text: 'Assessment Scores',
            x: -20 //center
        },
        subtitle: {
            text: '',
            x: -20
        },
        xAxis: {
            categories: []
        },
        yAxis: {
            title: {
                text: 'T-Score'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }],
            floor:10,
            ceiling:90,
            tickPositions:[10,20,30,40,50,60,70,80,90]
        },
        tooltip: {
            valueSuffix: ''
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series:mydata
        //series: [{
        //    name: 'Depression',
        //    data: data
        //}]
    });

  }

  angular.module('redcat.controllers')
    .controller('GraphController',['protocolsCache',GraphController]);
})();
