var pieDataSorted = [] // global to be used by radar chart

// when category is selected, display bar and pie chart
$('.categories-buttons').on('click', '.category-button', function() {

  // var barChart = 0;
  // var pieChart = 0;
  //
  // clear charts and comparisons
  if ($('#bar-chart').html() !== '') {
    barChart.clear();
  };

  if ($('#pie-chart').html() !== '') {
    pieChart.clear();
  };

  $('.comparison-text').empty();
  $('.comparison-buttons').empty();
  $('#radar-chart').empty();

  // store name of category selected
  var selectedCategory = $(this).text();
  console.log(selectedCategory)

  var barLabel = []; // names of the columns in barchart
  var barValues = []; // values of the columns in barchart
  var barData = []; // array of objects, name: group.city_name, city_id: group.city_id, category_name: group.category_name, group_count: group.group_count
  var topCity = 0; // the city that has most groups per category selected by the user
  var pieData = []; // array of objects, pieLabel: group.category_name, pieValue: group.group_count
  var pieValues = []; // values of the pieslices
  var pieLabel = []; // name of the pieslices

  // GET call to database
  var options = {
    type: "GET",
    url: 'http://localhost:3000/api/groups',
    dataType: 'json'
  };

  $.ajax(options).done(function(data) {

    // get bar chart data for selected category
    _.each(data, function(group) {
      if (group.category_name === selectedCategory) {
        barData.push({
          name: group.city_name,
          city_id: group.city_id,
          category_name: group.category_name,
          group_count: group.group_count
        });
      };
    });

    // sort bar chart data by group_count (high -> low)
    var barDataSorted = barData.sort(function(a, b) {
      return parseFloat(b.group_count) - parseFloat(a.group_count);
    });

    // push top 10 cities into barLabel and barValues
    for (var i = 0; i < 10; i += 1) {
      barLabel.push(barDataSorted[i].name);
      barValues.push(barDataSorted[i].group_count);
    };

    topCity = barLabel[0];

    console.log(barLabel);
    console.log(barValues);
    console.log(topCity);

    // DRAW THE BAR CHART //
    var ctxBar = $("#bar-chart").get(0).getContext("2d");

    var dataBar = {
      labels: barLabel,
      datasets: [{
        label: "Most probable cities",
        fillColor: "rgba(220,220,220,0.5)",
        strokeColor: "rgba(220,220,220,0.8)",
        highlightFill: "rgba(220,220,220,0.75)",
        highlightStroke: "rgba(220,220,220,1)",
        data: barValues
      }]
    };

    var optionsBar = {
      //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
      scaleBeginAtZero : true,

      //Boolean - Whether grid lines are shown across the chart
      scaleShowGridLines : true,

      //String - Colour of the grid lines
      scaleGridLineColor : "rgba(0,0,0,.05)",

      //Number - Width of the grid lines
      scaleGridLineWidth : 1,

      //Boolean - Whether to show horizontal lines (except X axis)
      scaleShowHorizontalLines: true,

      //Boolean - Whether to show vertical lines (except Y axis)
      scaleShowVerticalLines: true,

      //Boolean - If there is a stroke on each bar
      barShowStroke : true,

      //Number - Pixel width of the bar stroke
      barStrokeWidth : 2,

      //Number - Spacing between each of the X value sets
      barValueSpacing : 5,

      //Number - Spacing between data sets within X values
      barDatasetSpacing : 1,

      //String - A legend template
      legendTemplate : "<ul class=\"<%%=name.toLowerCase()%>-legend\"><%% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%%=datasets[i].fillColor%>\"></span><%%if(datasets[i].label){%><%%=datasets[i].label%><%%}%></li><%%}%></ul>"
    };



    // create new bar chart
  var barChart = new Chart(ctxBar).Bar(dataBar, optionsBar);


  // drawing the pie chart

  var ctxPie = $("#pie-chart").get(0).getContext("2d");
  // var ctxPie = document.getElementById("pie-chart").getContext("2d");

  var dataPie = [];

  for (var i = 0; i < 10; i += 1) {

    dataPie.push({ value: pieDataSorted[i].pieValue, color: "#5AD3D1", highlight: "#FFBF69", label: pieDataSorted[i].pieLabel });


    // get the pie chart data for top city
     _.each(data, function(group) {
       if (group.city_name === topCity) {
         pieData.push({
           pieLabel: group.category_name,
           pieValue: group.group_count
         });
       };
     });
     console.log(pieData);

     // sort most popular groups in top city
     pieDataSorted = pieData.sort(function(a, b) {
       return parseFloat(b.pieValue) - parseFloat(a.pieValue);
     });

    // DRAW THE PIE CHART //
    var ctxPie = $("#pie-chart").get(0).getContext("2d");

    var dataPie = [];

    // HELEN TO UPDATE COLORS //
    var colorPie = ['#FFFD6A', '#FFFD6A', '#FFFD6A', '#FFFD6A', '#FFFD6A', '#FFFD6A', '#FFFD6A', '#FFFD6A', '#FFFD6A', '#FFFD6A'];

    for (var i = 0; i < 10; i += 1) {
      dataPie.push({
        value: pieDataSorted[i].pieValue,
        color: colorPie[i],
        highlight: "#5AD3D1",
        label: pieDataSorted[i].pieLabel
      });
    };
    console.log(dataPie);

    var optionsPie = {
      //Boolean - Whether we should show a stroke on each segment
      segmentShowStroke : true,

      //String - The colour of each segment stroke
      segmentStrokeColor : "#fff",

      //Number - The width of each segment stroke
      segmentStrokeWidth : 2,

      //Number - The percentage of the chart that we cut out of the middle
      percentageInnerCutout : 50, // This is 0 for Pie charts

      //Number - Amount of animation steps
      animationSteps : 100,

      //String - Animation easing effect
      animationEasing : "easeOutBounce",

      //Boolean - Whether we animate the rotation of the Doughnut
      animateRotate : true,

      //Boolean - Whether we animate scaling the Doughnut from the centre
      animateScale : false,

      //String - A legend template
      legendTemplate : "<ul class=\"<%%=name.toLowerCase()%>-legend\"><%% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%%=segments[i].fillColor%>\"></span><%%if(segments[i].label){%><%%=segments[i].label%><%%}%></li><%%}%></ul>"
    };

    // create new pie chart
    var pieChart = new Chart(ctxPie).Pie(dataPie, optionsPie);

    // display the top city below the pie chart
    $("#top-city").append(topCity);

    // DISPLAY COMPARISON BUTTONS //
    // display top city
    var $newCompareText = $('<h3>').addClass('compare-text').text('Compare ' + barDataSorted[0].name + ' with:');
    $newCompareText.appendTo('.comparison-text');

    // generate top 9 city buttons
    for (var i = 1; i < 10; i += 1) {
      var $newCompareButton = $('<button>').addClass('compare-button').attr('data-city-id', barDataSorted[i].city_id).text(barDataSorted[i].name);
      $newCompareButton.appendTo('.comparison-buttons');
    };

  });
});

);
