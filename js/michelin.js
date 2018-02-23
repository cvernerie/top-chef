var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

const config = require('../config/michelin.json')


module.exports = {

    getFrenchStarredRestaurants: function(callback) {
        for (i = 0; i < 35; i++) {

            var restaurantPaginatedUrl = config.url + '/page-' + (i + 1)

            request(restaurantPaginatedUrl, function (error, response, html) {

                if (!error && response.statusCode === 200) {

                    var $ = cheerio.load(html);

                    var nbRestaurants = $('div[attr-gtm-type="poi"]').length
                    var restaurantsLinks = $('a[class="poi-card-link"]')

                    for (j = 0; j < nbRestaurants; j++) {

                        var restaurantUrl = 'https://restaurant.michelin.fr' + restaurantsLinks[j].attribs['href'];

                        request(restaurantUrl, function (error, response, html) {

                            if (!error && response.statusCode === 200) {

                                var sel = cheerio.load(html);

                                var name = sel('.poi_intro-display-title').text();

                                var zipCode = sel('.addressfield-container-inline .postal-code').first().text();

                                var nbStars = sel('.michelin-poi-distinctions-list .content-wrapper').text().charAt(0);

                                var str = '{' + '"name": ' + '"' + name.substr(7, name.length - 11) + '",' + ' "zipCode": "' + zipCode + '", ' + '"nbStars": ' + '"' + nbStars + '"},\n';

                                fs.appendFile('../data/restaurants.json', str)
                            }
                            else {
                                console.log("error lv2 : " + error.message + " on : " + j + " page : " + (i+1) + "nb on page : " + nbRestaurants + " => " + restaurantUrl)
                            }
                        });
                    }
                } else {
                    console.log("error lv1 : " + error.message + " on : " + config.url.concat('/page-', (i+1)))
                }

            });
        }
        callback("listRest");
    }
}