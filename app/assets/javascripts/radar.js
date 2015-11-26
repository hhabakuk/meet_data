// when comparison city is selected, display radar chart
$('.comparison-buttons').on('click','.compare-button',function() {
  // clear chart
  $('#radar-chart').remove();
  $('.radar-chart').append('<canvas id="radar-chart" width="600" height="400"><canvas>');

    $('#loading2').text('loading...');
  $(document).ajaxComplete(function() {
    $('#loading2').remove();
  });

  // store name of comparison city selected
  var selectedComparisonCity = $(this).text();
  console.log(selectedComparisonCity)

  var originCity = pieDataSorted; // top city data from pie chart data
  var compareCity = []; // array of objects, name: group.city_name, city_id: group.city_id, category_name: group.category_name, group_count: group.group_count
  var radarLabel = []; // values of the points on radar chart
  var radarCompareCityData = []; // values of the comparison city for radar chart
  var radarOriginCityData = []; // values of the top city for radar chart

  // GET call to database
  var options = {
    type: "GET",
    url: 'http://localhost:3000/api/groups',
    dataType: 'json'
  };

  $.ajax(options).done(function(data) {

    // get radar chart data for selected comparison city
    _.each(data, function(group) {
      if (group.city_name === selectedComparisonCity) {
        compareCity.push({
          name: group.city_name,
          city_id: group.city_id,
          category_name: group.category_name,
          group_count: group.group_count
        });
      };
    });

    // push group count of the top 6 categories into radarCompareCityData and radarOriginCityData
    for (var i = 0; i < 6; i += 1 ) {
      for (var j = 0; j < compareCity.length; j += 1 ) {
        if (compareCity[j].category_name === originCity[i].pieLabel) {
          radarCompareCityData.push(compareCity[j].group_count);
          radarOriginCityData.push(originCity[i].pieValue);
          radarLabel.push(originCity[i].pieLabel);
        };
      };
    };
    console.log(radarCompareCityData)
    console.log(radarOriginCityData)
    console.log(radarLabel)

    // DRAW THE RADAR CHART //
    var ctx = $("#radar-chart").get(0).getContext("2d");

    var dataRadar = {
      labels: radarLabel,
      datasets: [{
        label: "City1 name dataset",
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: radarCompareCityData
      }, {
        label: "City2 name dataset",
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        data: radarOriginCityData
      }]
    };

    var optionsRadar = {
      //Boolean - Whether to show lines for each scale point
      scaleShowLine : true,

      //Boolean - Whether we show the angle lines out of the radar
      angleShowLineOut : true,

      //Boolean - Whether to show labels on the scale
      scaleShowLabels : false,

      // Boolean - Whether the scale should begin at zero
      scaleBeginAtZero : true,

      //String - Colour of the angle line
      angleLineColor : "rgba(0,0,0,.1)",

      //Number - Pixel width of the angle line
      angleLineWidth : 1,

      //String - Point label font declaration
      pointLabelFontFamily : "Menlo",

      tooltipFontFamily: "Menlo",

      //String - Point label font weight
      pointLabelFontStyle : "normal",

      //Number - Point label font size in pixels
      pointLabelFontSize : 10,

      //String - Point label font colour
      pointLabelFontColor : "#666",

      //Boolean - Whether to show a dot for each point
      pointDot : true,

      //Number - Radius of each point dot in pixels
      pointDotRadius : 3,

      //Number - Pixel width of point dot stroke
      pointDotStrokeWidth : 1,

      //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
      pointHitDetectionRadius : 20,

      //Boolean - Whether to show a stroke for datasets
      datasetStroke : true,

      //Number - Pixel width of dataset stroke
      datasetStrokeWidth : 2,

      //Boolean - Whether to fill the dataset with a colour
      datasetFill : true,

      //String - A legend template
      legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
    }

    // create new radar chart
    var radarChart = new Chart(ctx).Radar(dataRadar, optionsRadar);

  });
});
