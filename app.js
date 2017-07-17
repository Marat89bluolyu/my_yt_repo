(function(){
  // Filter results
  $('.filter').on('keyup', function(e) {
    var filterQ = '.*' + $(e.target).val().toLowerCase()  + '.*';

    $('.results span').each(function(i, el) {
      var $el = $(el);

      elVal = $el.text().toLowerCase();

      ( !elVal.match(new RegExp(filterQ)) )
        ? $el.parents('li').hide()
        : $el.parents('li').show();
    });
  });

  // Make search request handler
  $('form').on('submit', function(e, page) {
    e.preventDefault();

    // Get current page
    var page = +page || 0;

    // Setup request
    var request = gapi.client.youtube.search.list({
      part: 'snippet',
      type: 'video',
      q: encodeURIComponent( $('.query').val() ).replace(/%20/g, '+'),
      maxResults: 20,
      order: 'viewCount'
    });

    // Run request
    request.execute(function(res) {
      // Show filter
      $('.filter-wrapper').show();

      // Empty prev results and show new
      $('.results').empty();
      showResults(page, res);

      // Show pagination
      showPagination(page, res);
    });
  });

  // Navigate with pagination links handler
  $('.pagination').on('click', 'a', function(e) {
    e.preventDefault();

    // Calculate page base on clicked link
    var page = $(e.target).text() - 1;

    // Trigger form for submit again with given page
    $('form').trigger('submit', [page]);
  });
})();



// Show search results
function showResults(page, res) {
  $.each(res.items, function(i, el) {
    // Limit from and to results
    var from = page * 5;
    var to = from + 4;

    // If not in range - return
    if ( !(i >= from && i <= to) ) return;

    // Append results markup
    $('.results').append(
      '<li>' +
        '<a href="https://www.youtube.com/watch?v=' + el.id.videoId + '">' +
          '<img src="' + el.snippet.thumbnails.high.url + '">' +
        '</a>' +

        '<span>' +
          el.snippet.title +
        '</span>' +
      '</li>'
    );
  });
}

// Show pagination
function showPagination(page, res) {
  var pages = Math.ceil(res.items.length / 5);

  // Clear previous pagination
  $('.pagination').empty();

  // Render new pagination: <span> for current and <a> for others
  for (var i = 1; i <= pages; i++) {
    if (i === page+1) {
      $('.pagination').append(
        '<li><span>' + i + '</span></li>'
      );
    } else {
      $('.pagination').append(
        '<li><a href="#">' + i + '</a></li>'
      );
    }
  }
}

// Init YouTube API
function init() {
  gapi.client.setApiKey('AIzaSyC7_HAyJMgutF96ARAofzSQbyGWWb64xYQ');

  gapi.client.load('youtube', 'v3', function() {
    // Enable search button when APi is ready
    $('.search').removeAttr('disabled');
  })
}
