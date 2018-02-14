const express = require('express');
const app = express();
const michelin = require('./js/michelin')
const lafourchette = require('./js/lafourchette')

app.get('/', function (req, res) {
 /*   michelin.getFrenchStarredRestaurants(function (restaurantsList) {
        res.send(restaurantsList)
    });*/
    lafourchette.findRestaurants()
    res.send('hello')
});

app.listen(3000, function () {
    console.log('My super app is listening on port 3000!')
});