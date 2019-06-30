//Adding all requires
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

//require moment.js
var moment = require('moment');
// require fs to read random.txt file
var fs = require("fs");
// require axios
var axios = require("axios");


//creating var to store command lines in argument index of 2, then run if fxs depending on the process.argv 2 entered
var command = process.argv[2];

//creating var to store user input to be used in each command query
var userInput = (process.argv.splice(3, process.argv.length - 1)).join(" ")

//creating functions for axios calls to each api (bands in town, spotify, and omdb )

var bandsInTownGet = function () {
    // Run the axios.get function...
    axios
        .get("https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp")
        .then(function (response) {
            //console log the venue name, location, and date for each event
            for (i = 0; i < response.data.length; i++) {
                //creating variable to store date in MM/DD/YYY
                var date = moment(response.data[i].datetime).format("MM-DD-YYYY")
                console.log("Venue:" + response.data[i].venue.name, "\n", "Location:" + response.data[i].venue.city, "\n", "Date of Event:" + date)
                console.log("---------------")
            };
        })

        //error catch
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });

};

var OMDBGet = function() {
    axios
        .get("http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy")
        .then(function (response) {
            console.log("---------------")
            console.log("Title: " + response.data.Title, "\n", "Year: " + response.data.Year, "\n", "IMDB Rating: " + response.data.imdbRating, "\n", 
            "Rotten Tomatoes Rating: " + response.data.Ratings[1].Value, "\n", "Country of Production: " + response.data.Country, "\n", 
            "Language: " + response.data.Language, "\n", "Plot: " + response.data.Plot, "\n", "Actors: " + response.data.Actors)
            console.log("---------------")

        })

        //error catch
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });

};

var spotifyGet = function () {
    spotify
    .search({ type: 'track', query: userInput, limit: 1 })
    .then(function(response) {
        console.log("---------------")
            console.log("Artist(s): " + response.tracks.items[0].artists[0].name,"\n", "Track Name: " + response.tracks.items[0].name, 
            "\n", "Spotify URI: " + response.tracks.items[0].uri,"\n", "Album: " + response.tracks.items[0].album.name)
        console.log("---------------")

    })
    .catch(function(err) {
      console.log(err);
    });
};

var randomGet = function () {
    fs.readFile("random.txt", "utf8", function(error, data) {

        if (error) {
          return console.log(error);
        }
      
        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");
      
        command = dataArr[0];
        userInput = dataArr[1];
        spotifyGet(command, userInput)
      });
}



//calling get functions depending on command entry 

if (!userInput && command === "movie-this") {
    userInput = "Mr. Nobody";
  }

if (!userInput && command === "spotify-this-song") {
    userInput = "The Sign";
  }

if (command === "concert-this") {
    console.log(userInput)
    bandsInTownGet();
}

if (command === "spotify-this-song") {
    console.log(userInput);
    spotifyGet();
}

if (command === "movie-this") {
    console.log(userInput);
    OMDBGet();
    
} 

if (command === "do-what-it-says") {
    randomGet();

}