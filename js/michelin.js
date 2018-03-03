var request = require('request');
var cheerio = require('cheerio');

const config = require('../config/michelin.json')

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});

module.exports = {

    loadFrenchStarredRestaurantsFromFile: function (callback) {
        const restaurants = require('../data/michelinRestaurants')

        for (i = 0; i < restaurants.length; i++) {
            client.create({
                index: 'top_chef_michelin_restaurants',
                type: 'restaurant',
                id: i,
                body: {
                    name: restaurants[i].name,
                    zipCode: restaurants[i].zipCode,
                    nbStars: restaurants[i].nbStars
                }
            }, function (error, response) {
            });
        }
    },

    loadFrenchStarredRestaurants: function(callback) {
        for (i = 0; i < 35; i++) {
            getMichelinRestaurants(i + 1)
        }
        callback("listRest");
    }
}

function getMichelinRestaurants(page)
{
    var restaurantPaginatedUrl = config.url + '/page-' + (page + 1)

    request(restaurantPaginatedUrl, function (error, response, html) {

        if (!error && response.statusCode === 200) {

            var $ = cheerio.load(html);

            var nbRestaurants = $('div[attr-gtm-type="poi"]').length
            var restaurantsLinks = $('a[class="poi-card-link"]')

            for (j = 0; j < nbRestaurants; j++) {
                loadRestaurant(page * 18 + j, restaurantsLinks[j])
            }
        } else {
            console.log("error lv1 : " + error.message + " on : " + config.url.concat('/page-', (page)))
        }

    });
}

function loadRestaurant(id, restaurantLink)
{
    var restaurantUrl = 'https://restaurant.michelin.fr' + restaurantLink.attribs['href'];

    request(restaurantUrl, function (error, response, html) {

        if (!error && response.statusCode === 200) {

            var sel = cheerio.load(html);

            var name = sel('.poi_intro-display-title').text();

            var zipCode = sel('.addressfield-container-inline .postal-code').first().text();

            var nbStars = sel('.michelin-poi-distinctions-list .content-wrapper').text().charAt(0);

            client.create({
                index: 'top_chef_michelin_restaurants',
                type: 'restaurant',
                id: id,
                body: {
                    name: name.substr(7, name.length - 11),
                    zipCode: zipCode,
                    nbStars: nbStars
                }
            }, function (error, response) {
                console.log(error ? error.message : response.statusCode)
            });
        }
        else {
            console.log("error lv2 : " + error.message + " on : " + id + " => " + restaurantUrl)
        }
    });
}