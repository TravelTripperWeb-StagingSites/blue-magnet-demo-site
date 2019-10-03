'use strict';

function displaySearchResults(term, results, store) {
  console.log("Search Results");
  //console.log(results);
  var searchResults = document.getElementById('search-results');
  if (results && results.length) {
    var appendString = '';

    for (var i = 0; i < results.length; i++) {
      // Iterate over the results
      var item = store[results[i].ref];
      appendString += '<div class="search-item col-12 mb-2"><a class="h5 mb-1"  href="' + item.url + '">' + item.title + '</a>';
      appendString += '<p class="paragraph-small">' + item.content.substring(0, 150) + '...</p></div>';
    }

    searchResults.innerHTML = appendString;
  } else {
    searchResults.innerHTML = '<p class="h4 mb-2">No results found for "' + term + '"</p>';
  }
}

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');

  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');

    if (pair[0] === variable) {
      return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
    }
  }
}

document.ready(function () {

  var searchTerm = getQueryVariable('query');
  if (searchTerm) {
    if (document.getElementById('search')) {
      document.getElementById('search').setAttribute("value", searchTerm);
    }

    // Initalize lunr with the fields it will be searching on. I've given title
    // a boost of 10 to indicate matches on this field are more important.
    var store = window.lunrDocs;

    var idx = lunr(function () {
      this.field('id');
      this.field('title', { boost: 10 });
      this.field('content');

      for (var key in store) {
        // Add the data to lunr
        this.add({
          'id': key,
          'title': store[key].title,
          'content': store[key].content
        });
      }
    });

    // console.log("idx");
    // console.log(idx);
    //
    // console.log("window.store");
    // console.log(window.store);


    var results = idx.search(searchTerm); // Get lunr to perform a search
    displaySearchResults(searchTerm, results, store); // We'll write this in the next section
  }
});
