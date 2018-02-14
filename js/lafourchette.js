const request = require('request');
const cheerio = require('cheerio');

const config = require('../config/lafourchette.json');
const url = config.url;

var restaurants = require('../data/restaurants.json');

module.exports = {
    findRestaurants : function (callback) {
        console.log(restaurants.length)
        request(url, function (error, response, html) {
            if (!error && response.statusCode === 200) {

            }
        })
    }
};