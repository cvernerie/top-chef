const request = require('request');
const cheerio = require('cheerio');
var fs = require('fs');

const config = require('../config/lafourchette.json');

const michelinRestaurants = require('../data/restaurants')
const lafourchetteRestaurants = require('../data/lafourchetteRestaurantsIds')

module.exports = {

    findRestaurants : function (callback) {

        for(i = 0; i < michelinRestaurants.length; i++) {
            getLaFourchetteRestaurant(michelinRestaurants[i])
        }
    },

    findDeals: function (callback) {
        for(i = 0; i < lafourchetteRestaurants.length; i++) {
            getLafourchetteDeals(lafourchetteRestaurants[i])
        }
    }
};

function getLafourchetteDeals(lafourchetteRestaurant) {
    var searchUrl = encodeURI(config.apiHost + config.dealUrl.replace("%s", lafourchetteRestaurant.id))

    request(searchUrl, function (error, response, html) {

        if (!error && response.statusCode === 200) {

            var jsonResults = JSON.parse(response.body)

            var deals = []

            for(j = 0; j < jsonResults.length; j++) {
                if (jsonResults[j].is_special_offer) {
                    deals.push(jsonResults[j])
                }
            }

            fs.appendFile('./lafourchetteDeals.json',
                '{ "restaurantId": '
                + lafourchetteRestaurant.id
                + ', "deals": '
                + JSON.stringify(deals)
                + '},\n')

        } else {
            console.log("error : " + searchUrl)
        }
    })
}

function getLaFourchetteRestaurant(michelinRestaurant) {

    var searchUrl = encodeURI(config.apiHost + config.searchUrl + michelinRestaurant.name);

    request(searchUrl, function (error, response, html) {

        if (!error && response.statusCode === 200) {

            var jsonResults = JSON.parse(response.body);

            for (j = 0; j < jsonResults.length; j++) {

                if (jsonResults[j].address.postal_code === michelinRestaurant.zipCode) {

                    fs.appendFile('./lafourchetteRestaurantsIds.json', JSON.stringify(jsonResults[j]) + ',\n')
                }
            }
        } else {
            console.log("error : " + searchUrl)
        }
    })
}