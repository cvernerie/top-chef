const request = require('request');
const cheerio = require('cheerio');

const config = require('../config/michelin.json');
const url = config.url;

module.exports = {
    getFrenchStarredRestaurants : function (callback) {
        var restaurants = [];

        for (i = 1; i<35; i++){
            page = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin'.concat('/page-',i);
            request(page, function (error, response, html) {
                if (!error && response.statusCode == 200) {
                    var $ = cheerio.load(html);
                    restaurantsByPage = $('div[attr-gtm-type="poi"]');
                    hrefByPage = $('a[class="poi-card-link"]');
                    for (j = 0; j < restaurantsByPage.length; j++) {
                        var href = hrefByPage[j].attribs['href'];
                        var page2 = 'https://restaurant.michelin.fr'.concat(href);
                        request(page2, function (error, response, html) {
                            if (!error && response.statusCode == 200) {
                                var sel = cheerio.load(html);

                                var title = sel('.poi_intro-display-title').text();
                                var addr_Zip = sel('.addressfield-container-inline .postal-code').first().text();

                                restaurants.push({
                                    "nom": title,
                                    "zip": addr_Zip
                                });
                                console.log("{" + "'nom' : " + "'"+title+ "',"+ " 'zip' : '" +addr_Zip+ "'" + "},");
                            }
                        });
                    }
                }

            });
        }
        callback(restaurants);
    }
};