const request = require('request');
const cheerio = require('cheerio');

const config = require('../config/michelin.json');
const url = config.url;

module.exports = {
    getFrenchStarredRestaurants : function (callback) {
        request(url, function (error, response, html) {
            if (!error && response.statusCode === 200) {
                var $ = cheerio.load(html);
                $('.content .field__item.even  a').each(function(i, element){

                    console.log($(element).attr('href'));
                });
            }
        });
        callback("listRest");
    }
};