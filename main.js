var request = require('request');

module.exports = function(api_key) {
    var base_url = 'https://api.mongolab.com/api/1';

    var get_total_runs_query = base_url 
        + '/databases/scraper_test/collections/auto_parser?c=true&apiKey=' 
        + api_key;

    var get_total_show_yielding_runs_query = base_url
        + '/databases/scraper_test/collections/auto_parser?q={"shows_processed": {"$ne": 0}}&c=true&apiKey='
        + api_key;

    var remove_runs_query = base_url 
        + '/databases/scraper_test/collections/auto_parser?q={"shows_processed": 0}&c=true&apiKey='
        + api_key;

    var total_runs;
    var total_show_yielding_runs;
    var runs_to_remove;

    request(get_request(get_total_runs_query, 'GET', {}),
           function(error, response, body){
              console.log('Total runs: ' + body);
              total_runs = parseInt(body);
              request(get_request(get_total_show_yielding_runs_query, 'GET', {}),
                  function(error, response, body) {
                      console.log('Total show yielding runs: ' + body);
                      total_show_yielding_runs = parseInt(body);
                      request(get_request(remove_runs_query, 'GET', {}),
                          function(error, response, body) {
                              console.log('Total shows to remove: ' + body);
                              runs_to_remove = parseInt(body);
                              if (total_runs - runs_to_remove == total_show_yielding_runs) {
                                 console.log('Checksum passed!');
                              } else {
                                 console.log('Checksum failed!');
                              } 
                          });
                  });
           }); 

};

function get_request(query, http_method, body) {
    if (http_method == 'GET') {
        return {
            uri: query,
            method: http_method,
            timeout: 10000,
            followRedirect: true,
            maxRedirects: 10};
    } else if (http_method == 'PUT') {
        return {
            uri: query,
            method: http_method,
            timeout: 10000,
            followRedirect: true,
            maxRedirects: 10};
    } else {
        return null;
    }
}

