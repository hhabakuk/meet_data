//when the compared city is chosen, inherite categories from the pie search by the compared city name.
// listen to the city list on click, get the city name
$('.comparison-buttons').on('click','.compare-button',function() {

  console.log(pieDataSorted);

  var compareNameClicked = $(this).text();
  console.log(compareNameClicked)

  //get data from api
  var options = {
    type: "GET",
    url: 'http://localhost:3000/api/groups',
    dataType: 'json'
  };

  var compareCity = [];
  var originCity = pieDataSorted;
  var radarLabel = [];
  // var compareCity_data = [];
  // var originCity_data = display_cities;

  var radarCompareCityData = [];
  var radarOriginCityData = [];

  $.ajax(options).done(function(data) {
    _.each(data, function(group) {
      if (group.city_name === compareNameClicked) {
        compareCity.push({
          name: group.city_name,
          city_id: group.city_id,
          category_name: group.category_name,
          group_count: group.group_count
        });
      };
    });

    console.log(compareCity);

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

// draw the radar chart
   var ctx = $("#radar-chart").get(0).getContext("2d");

   var dataRadar = {
     labels: radarLabel,
     datasets: [
       {
         label: "City1 name dataset",
         fillColor: "rgba(220,220,220,0.2)",
         strokeColor: "rgba(220,220,220,1)",
         pointColor: "rgba(220,220,220,1)",
         pointStrokeColor: "#fff",
         pointHighlightFill: "#fff",
         pointHighlightStroke: "rgba(220,220,220,1)",
         data: radarCompareCityData
       },
       {
         label: "City2 name dataset",
         fillColor: "rgba(151,187,205,0.2)",
         strokeColor: "rgba(151,187,205,1)",
         pointColor: "rgba(151,187,205,1)",
         pointStrokeColor: "#fff",
         pointHighlightFill: "#fff",
         pointHighlightStroke: "rgba(151,187,205,1)",
         data: radarOriginCityData
       }
     ]
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
    pointLabelFontFamily : "'Arial'",

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
  var radarChart = new Chart(ctx).Radar(dataRadar, optionsRadar);

  // console.log(compareCity)
  //pieData inheritate from pie chart data

  // console.log(originCity)
  // console.log(radarLabel)
  // console.log(radarCompareCityData)
  // console.log(originCity_data)
//
});
});
