const request = require('request');
const config = require('../config/lafourchette.json');

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});

const michelinRestaurants = require('../data/michelinRestaurants')

module.exports = {

    findRestaurants : function (callback) {
        for (var i = 0; i < michelinRestaurants.length; i++) {
            getLaFourchetteRestaurant(michelinRestaurants[i], i)
        }
    },
};

function getLaFourchetteRestaurant(michelinRestaurant, i) {

    var id = i

    var searchUrl = encodeURI(config.apiHost + config.searchUrl + michelinRestaurant.name);

    request(searchUrl, function (error, response, html) {

        if (!error && response.statusCode === 200) {

            var jsonResults = JSON.parse(response.body);

            for (j = 0; j < jsonResults.length; j++) {

                if (jsonResults[j].address.postal_code === michelinRestaurant.zipCode) {
                    getLafourchetteDeals(jsonResults[j], i)
                }
            }
        } else {
            if (error) {
                throw error
            }
        }
    })
}

function getLafourchetteDeals(lafourchetteRestaurant, i) {
    var id = i
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

            lafourchetteRestaurant.deals = deals;

            client.create({
                index: 'top_chef_lafourchette_restaurants',
                type: 'restaurant',
                id: id,
                body: {
                    lafourchetteRestaurant
                }
            }, function (error, response) {
            })

        } else {
            if (error) {
                throw error
            }
        }
    })
}