var options = { 
  url: 'http://localhost:3000/api/categories',
  type: 'get',
  dataType: 'json'
};

$.ajax(options).done(function(data) {
  _.each(data, function(category, index) {
    var $newCategoryButton = $('<button>').addClass('category-button').attr('data-categoryid', category.id).text(category.name);
    $newCategoryButton.appendTo('.categories-buttons')
  });
});
