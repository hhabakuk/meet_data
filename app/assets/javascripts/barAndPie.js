$('.categories-buttons').on('click', '.category-button', function() {
  console.log('hello');
  var category_name_clicked = $(this).text();

  console.log(category_name_clicked)
  var options = {
    type: "GET",
    url: 'http://localhost:3000/api/groups',
    dataType: 'json'
  };

// changed the variable names as otherwise they wouldve conflicted with chart.js conventions.
  var chart_label = []
  var chart_data = []
  var combination = []

  $.ajax(options).done(function(groups) {
    _.each(groups, function(group) {
      if (group.category_name === category_name_clicked) {
        combination.push({ name: group.city_name, group_count: group.group_count})
      };
    });

    var display_cities = combination.sort(function(a, b) {
      return parseFloat(b.group_count) - parseFloat(a.group_count);
    });
    console.log(display_cities)

    for (var i = 0; i <= 10; i += 1) {
      chart_label.push(display_cities[i].name);
      chart_data.push(display_cities[i].group_count);
    };
    console.log(chart_label)
    console.log(chart_data)

//drawing the table

var ctx = $("#bar-chart").get(0).getContext("2d");


var data = {
    labels: chart_label,
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: chart_data
        },
    ]
};

var options = {
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

}

var myBarChart = new Chart(ctx).Bar(data, options);

  });


});
