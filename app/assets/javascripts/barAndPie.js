var pieDataSorted = [] // global to be used by radar chart
var groupData = 0

// when category is selected, display bar and pie chart
$('.categories-buttons').on('click', '.category-button', function() {

  // display loading until data has been retrieved
  $('#loading').text('loading...');
  $(document).ajaxComplete(function() {
    $('#loading').attr("style", "display:none");
  });

  // clear values when another category is selected
  $('.comparison-text').empty();
  $('.comparison-buttons').empty();
  $('#top-city').empty();
  $('#top-city-category-groups').empty();
  $('#top-city-all-groups').empty();
  $('.go-to-map').empty();
  $("#top-city-category-groups2").empty();

  // clear charts when another category is selected
  $('#bar-chart').remove();
  $('.bar-chart').append('<canvas id="bar-chart" width="300" height="300"><canvas>');

  $('#pie-chart').remove();
  $('.pie-chart').append('<canvas id="pie-chart" width="400" height="200"><canvas>');

  $('#radar-chart').remove();
  $('.radar-chart').append('<canvas id="radar-chart" width="400" height="400"><canvas>');

  // store name of category selected
  var selectedCategory = $(this).text();
  console.log(selectedCategory);

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

    groupData = data;

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
      scaleFontFamily : "Menlo",
      tooltipFontFamily: "Menlo",
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

    // calculate pie percentage
    var totalPie = 0;
    for (var i = 0; i < pieDataSorted.length; i += 1) {
      totalPie += pieDataSorted[i].pieValue;
    };

    var piePercentage = 0;
    piePercentage = ((barDataSorted[0].group_count / totalPie) * 100).toFixed(2) + '%';

    var optionsPie = {
      tooltipFontFamily: "Menlo",

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
      animationEasing : "easeInOutExpo",

      //Boolean - Whether we animate the rotation of the Doughnut
      animateRotate : true,

      //Boolean - Whether we animate scaling the Doughnut from the centre
      animateScale : false,

      onAnimationComplete: function () {

        //setup the font and center it's position
        this.chart.ctx.font = 'Normal 14px Menlo';
        this.chart.ctx.fillStyle = '#808080';
        this.chart.ctx.textAlign = 'center';
        this.chart.ctx.textBaseline = 'middle';

        //find the center point
        var x = this.chart.canvas.clientWidth / 2;
        var y = this.chart.canvas.clientHeight / 2;

        //hack to center different fonts
        var x_fix = 0;
        var y_fix = 2;

        //render the text
        this.chart.ctx.fillText(piePercentage, x + x_fix, y + y_fix);
      },

      //String - A legend template
      legendTemplate : "<ul class=\"<%%=name.toLowerCase()%>-legend\"><%% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%%=segments[i].fillColor%>\"></span><%%if(segments[i].label){%><%%=segments[i].label%><%%}%></li><%%}%></ul>"
    };

    var dataPie = [];

    // get pie data
    for (var i = 0; i < 33; i += 1) {
      dataPie.push({
        value: pieDataSorted[i].pieValue,
        color: "#00ADB3",
        highlight: "#ef4b5d",
        label: pieDataSorted[i].pieLabel
      });

      // highlight the selected category
      if (pieDataSorted[i].pieLabel === selectedCategory) {
        console.log('label: ' , pieDataSorted[i].pieLabel, 'cat: ', selectedCategory);
        dataPie[i].color = '#ef4b5d';
      };
    };

    // create new pie chart
    var pieChart = new Chart(ctxPie).Pie(dataPie, optionsPie);

    ///////////////////
  //customize the pie chart interms of the cities on clicked
//get the city name on clicked bar
    $('.bar-chart').on('click',function(evt){
      var activeBars = barChart.getBarsAtEvent(evt);
      // => activeBars is an array of bars on the canvas that are at the same position as the click event.
      var cityNameOnBar = activeBars[0].label;
      //get the data with the clicked city name
      pieData = [];
      _.each(data, function(group) {
        if (group.city_name === cityNameOnBar) {
          // console.log(cityNameOnBar)
           pieData.push({ cityName: group.city_name, pieLabel: group.category_name, pieValue: group.group_count})
         };
      });
      console.log(pieData);
      //sort the dataset befor displaying on chart
      pieDataSorted = pieData.sort(function(a, b) {
        return parseFloat(b.pieValue) - parseFloat(a.pieValue);
      });
      //update the value in piechart
      for (var i = 0; i < 33; i += 1) {
        pieChart.segments[i].value = pieDataSorted[i].pieValue;
        pieChart.segments[i].label = pieDataSorted[i].pieLabel;
      };
     // Calling update now animates the circumference ,and transitions other segment widths
      pieChart.update();

      $("#top-city").html(cityNameOnBar);
      $('.compare-text').html('Compare ' + cityNameOnBar + ' with:');

      // update city information
      var topCityCategoryGroups = activeBars[0].value;

      $("#top-city-category-groups").text('People like you have formed ' + topCityCategoryGroups + ' groups')
      $("#top-city-category-groups2").text('to discuss ' + selectedCategory);

      totalPie = 0;
      for (var i = 0; i < pieDataSorted.length; i += 1) {
        totalPie += pieDataSorted[i].pieValue;
      };

      piePercentage = 0;
      piePercentage = ((topCityCategoryGroups / totalPie) * 100).toFixed(2) + '%';

      // render comparison buttons
      $('.compare-button').remove();

      // update compare city name
      $('.compare-text').text('Compare ' + cityNameOnBar + ' with:');

      // generate top 9 city buttons
      for (var i = 0; i < 10; i += 1) {
        if (barDataSorted[i].name !== cityNameOnBar) {
          var $newCompareButton = $('<a href="#compare">').addClass('compare-button smoothScroll').text(barDataSorted[i].name);

          $newCompareButton.appendTo('.comparison-buttons');
        };
      };

    });

    // display the top city below the pie chart
    $("#top-city").append(topCity);

    // display the number of groups in the selected category in top city
    var topCityCategoryGroups = barDataSorted[0].group_count;

    $("#top-city-category-groups").text('People like you have formed ' + topCityCategoryGroups + ' groups')
    $("#top-city-category-groups2").text('to discuss ' + selectedCategory);

    // display the number of all groups in the top city
    var topCityAllGroups = 0


    // for (var i = 0; i < pieDataSorted.length; i += 1) {

    //   topCityAllGroups += pieDataSorted[i].pieValue << 0;
    // };

    //  $("#top-city-all-groups").append('and ' + topCityAllGroups + ' other groups to join');



    // DISPLAY COMPARISON BUTTONS //

    var $newCompareText = $('<h3>').addClass('compare-text').text('Compare ' + barDataSorted[0].name + ' with:');
    $newCompareText.appendTo('.comparison-text');

    var $goToMap = $('<a href="#to-map">').addClass('compare-button smoothScroll').text("check out the world");
    $goToMap.appendTo('.go-to-map');


    // generate top 9 city buttons
    for (var i = 1; i < 10; i += 1) {
      var $newCompareButton = $('<a href="#compare">').addClass('compare-button smoothScroll').attr('data-city-id', barDataSorted[i].city_id).text(barDataSorted[i].name);
      $newCompareButton.appendTo('.comparison-buttons');
    };
    jQuery(function($){ $.localScroll({filter:'.smoothScroll'}); });

  });

  $('#loading').attr("style", "display:block");
});
