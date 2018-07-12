require("dotenv").config();

//my requires 
var keys = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request'); 
var fs = require('fs');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//switch statement to figue out i
function runApi(command, searchTerm){
  switch(command){
    case "my-tweets":
      tweets(searchTerm);
      break;
    
    case "spotify-this-song":
      spotifySong(searchTerm);
      break;

    case "movie-this":
      omdb(searchTerm);
      break;

    case "do-what-it-says":
      doThis();
      break;
    
    default:
      console.log("I don't know what to do");
  }
}

//Twitter Function
// it should display my last 20 tweets
function tweets(searchTerm){

  if(!searchTerm){
    searchTerm = "@shay12631184";
  }


var params = {screen_name: searchTerm};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    console.log(tweets.length);

    for(let i = 0; i < 20; i++){
      console.log(tweets[i].text);
    }
  }
});
}

//spotify function
//should show the Artist, the song name, a preview link of the song from spotify, and the album
var artistName = function(artist) {
  return artist.name;
}

var spotifySong = function (searchTerm){ 
var params = searchTerm;
spotify.search({ type: 'track', query: params }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
  var songs = data.tracks.items;
    // console.log(songs);
    for(let i = 0; i < songs.length; i++){
      console.log(i);
      console.log("artist: " + songs[i].artists.map(artistName));
  
      console.log('song name: ' + songs[i].name); 
      console.log('preview this song: ' + songs[i].preview_url);
      console.log('album: ' + songs[i].album.name);
      console.log("______________________________________________________________________");
      }

});
}


// OMDB function
// shows: tite, year, rating, rotten tomatoes rating, country, language, plot, and actors
// if nothing is put in it should display info from the movie Mr. Nobody
function omdb(searchTerm){
 
  if(!searchTerm){
    searchTerm = "Mr Nobody";
    console.log("If you Havent Watched 'Mr. Nobody', then you should");
    console.log("It's on Netflix!");
} else {
  searchTerm = searchTerm;
}
console.log(searchTerm);
  request('http://www.omdbapi.com/?t=' + searchTerm + "&apikey=trilogy", function (error, response, body) {
    // Print the error if one occurred
    console.log('error:', error); 
    // Print the response status code if a response was received
    console.log('statusCode:', response && response.statusCode);
    // Print the HTML for the Google homepage.
    // console.log('body:', body);
    var jsonData = JSON.parse(body)
    console.log("_________________________________");
    console.log("Title: " + jsonData.Title);
    console.log("Year: " + jsonData.Year);
    console.log("IMDB Rating: " + jsonData.imdbRating);
    console.log("Actors: " + jsonData.Actors);
    console.log("Language: " + jsonData.Language);
    console.log("Country: " + jsonData.Country);
    console.log("Plot: " + jsonData.Plot);
    console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
    console.log("_________________________________");
});
    
}

//do this function
//Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
// It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
function doThis(){
  fs.readFile('random.txt' , 'utf8', function (error, data){
    if (!error) {
      var dataArr = data.split(",");
      console.log(dataArr[1]);
      spotifySong(dataArr[1]);
  }
})
}



  

//[2]= the command (my-tweets", "spotify-this-song" [3]= seach term like (song name, movie title)
runApi(process.argv[2], process.argv[3]);