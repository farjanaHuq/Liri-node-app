require("dotenv").config();
var keys = require('./keys.js');
var axios = require('axios');
var Spotify = require('node-spotify-api');
var Omdb = require('omdb-client');
var fs = require('fs');

// variable to take arguments from user
var userLog = process.argv[2];
var request = process.argv.slice(3).join('-');

//seatGeek key and url
var seatGeek = keys.seatGeek;
var seatGeekURL = `https://api.seatgeek.com/2/events?performers.slug=${request}&client_id=${seatGeek.id}`;

//instantiate a spotify object
var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});

//takes user choice and displays the info
if (userLog === 'do-what-it-says') {
    //read the random.txt file to identify the user request
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) return console.log(err);
        // console.log(data);
        //puts the strings from random.txt file to an array
        var dataArr = data.split(',');
        dataArr[0] = dataArr[0].trim();
        dataArr[1] = dataArr[1].trim();
        if (dataArr[1].indexOf('"') === 0) dataArr[1] = dataArr[1].slice(1, -1);
        //saves the user choice and request in variables 'userLog' and 'request' respectively
        userLog = dataArr[0];
        request = dataArr[1];
        doWhatItSays();

    });
}
else {
    doWhatItSays();
}


//=================================CallBack Functions=================================================
//function takes the user choice n request for concert/song/movie and displays the corresponding infos
function doWhatItSays() {
    //user choice is 'concert-this' and request is the band name
    if (userLog === 'concert-this') {

        axios.get(seatGeekURL)

            .then(function (resp) {
            var seatGeekRequest = `
                Venue: ${resp.data.events[0].venue.name}
                Location: ${resp.data.events[0].venue.address}
                Location extended: ${resp.data.events[0].venue.extended_address}
                Data/Time: ${resp.data.events[0].datetime_utc}
                `
                console.log(seatGeekRequest);
                logTxt(seatGeekRequest);
            })
            .catch(function (err) {
                console.error(err);
            })
    }
    //user choice is 'spotify-this-song' and request is a song title
    else if (userLog === 'spotify-this-song') {
        spotify.search({ type: 'track', query: request }, function (err, data) {

            if (err) {
                return console.log('Error occurred: ' + err);
            }
            else if (data.tracks.items.length >= 1) {

                spotifyRequest(data.tracks.items[0]);
            }
            else {
                spotify.search({ type: 'track', query: 'ace of base' }, function (err, data) {
                    if (err) {
                        return console.log('Error occurred: ' + err);
                    } else {
                        console.log('Song not found. Try this song instead.');
                        spotifyRequest(data.tracks.items[0]);
                    }
                });
            }
        });
    }
    //user choice is 'movie-this' and request is a movie title
    else if (userLog === 'movie-this') {
        if (process.argv.length > 3) {
            omdbRequest(request);
        }
        else {
            omdbRequest('Mr. Nobody');
        }
    }
}

//take the omdb request as an argument and print the request
function omdbRequest(request) {
    var params = {
        apiKey: keys.omdb.id,
        title: request,
    }
    Omdb.get(params, function (err, data) {

        if (err) {
            return console.log("Error occured");
        }
        else {
        var omdbRequest = `
            Title of the movie: ${data.Title}
            Year the movie came out: ${data.Year}
            IMDB Rating: ${data.imdbRating}
            Rotten Tomatoes Rating: ${data.Ratings[1].Value}
            Country where the movie was produced: ${data.Country}
            Language of the movie: ${data.Language}
            Plot of the movie: ${data.Plot}
            Actors in the movie: ${data.Actors} `

            console.log(omdbRequest);
            logTxt(omdbRequest);

        }
    });
}

//print the spotify request
function spotifyRequest(response) {
    var spotifyRequest = `
        Artist: ${response.artists[0].name}
        Song's Name: ${response.name}
        Preview Url: ${response.preview_url}
        Album Name: ${response.album.name}
        `
    console.log(spotifyRequest);

    logTxt(spotifyRequest);
}
//append the info from user request to the log.txt file
function logTxt(info){
    fs.appendFile("./log.txt", info, function (err) {
        // If an error was experienced we will log it.
        if (err) return console.log(err);
        // If no error is experienced, we'll log the phrase "Content Added" to our node console.
        else {
            console.log("Content Added!");
        }
    });
}
