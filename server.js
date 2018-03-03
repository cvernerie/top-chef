const express = require('express');
const app = express();
const lafourchette = require('./js/lafourchette')

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});

app.get('/lafourchette-deals', function (req, res) {
    client.search({
        index: 'top_chef_lafourchette_restaurants',
        body: {
            from : 0,
            size : 1000,
            query: {
                match_all: {}
            }
        }
    }, function (error, response) {
        var resultSet = response.hits.hits
        var restaurants = []
        for (var i = 0; i < resultSet.length; i++) {
            restaurants.push(resultSet[i]._source.lafourchetteRestaurant)
        }
        res.send(restaurants)
    })
})

app.listen(8080, function () {
    console.log('Express server is listening on port 8080!')
    lafourchette.findRestaurants()
})