//when the compared city is chosen, inherite categories from the pie search by the compared city name.
// listen to the city list on click, get the city name
$('.categories-buttons').on('click','.category-button',function(){
    var compareNameClicked = $(this).text();
    //get data from api
    var options = {
      type: "GET",
      url: 'http://localhost:3000/api/groups',
      dataType: 'json'
    };
     
      var compareCity = [];
      //pieData inheritate from pie chart data
      var originCity = [];
      var labelsRadar = [];
      var compareCity_data = [];
      var originCity_data = [];

    $.ajax(options).done(function(groups){
    
      _.each(groups,function(group){
        if (group.city_name === "New York"){
          compareCity.push(group);
          labelsRadar.push(group.category_name);
         };
       });
         console.log(compareCity[0].category_name === labelsRadar[0]);
         
      for (var i=0; i<labelsRadar.length;i +=1 ){
         for(var j=0; j<compareCity.length;j +=1){
           if (compareCity[j].category_name === labelsRadar[i]) {
            compareCity_data.push(compareCity[j].group_count);
           }; 
          //  else if (labelsRadar[i] === originCity[j].category_name){
          //   originCity_data.push(originCity[y].group_count);
          // };          
        };
      };
      



// draw the radar chart
     var ctx = $("#radar-chart").get(0).getContext("2d");


     var dataRadar = {
       labels: labelsRadar,
       datasets: [
        {
            label: "City1 name dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
           data: compareCity_data
        },
           {
            label: "City2 name dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 96, 27, 100]
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
  
 
  });
});



// get categories from both cities

// according to categories and city names, fetch data of group numbers
//  assign city name, label name and value to the radar chart


