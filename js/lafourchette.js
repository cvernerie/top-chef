const request = require('request');
const cheerio = require('cheerio');
var fs = require('fs');

const config = require('../config/lafourchette.json');

const michelinRestaurants = require('../data/restaurants')

module.exports = {

    findRestaurants : function (callback) {

        for(i = 0; i < michelinRestaurants.length; i++) {
            getLaFourchetteRestaurant(michelinRestaurants[i])
        }
    }
};

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