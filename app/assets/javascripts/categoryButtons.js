var options = {
  url: '/api/categories',
  type: 'get',
  dataType: 'json'
};

$.ajax(options).done(function(data) {
  _.each(data, function(category, index) {
    var $newCategoryButton = $('<button>').addClass('category-button').attr('data-category-id', category.id).text(category.name);

    if (category.name === "Women") {
      var $newCategoryButton = $('<button>').addClass('category-button').attr('id', 'pink').text(category.name);
    }
    $newCategoryButton.appendTo('.categories-buttons')
  });
});
