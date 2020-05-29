require('dotenv').config();
const express = require('express'); 
const spotifyAPI = require('spotify-web-api-node'); 
const spotify_passport = require ('passport-spotify'); 
const clientID = process.env.CLIENT_ID; 
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.CALLBACK_URL; 
const spotify = new spotifyAPI({
    clientId: clientID,
    clientSecret: clientSecret, 
    redirectUri: redirectUri
})
spotify.setAccessToken(process.env.SPOTIFY_TOKEN); 


var app = express(); 
app.set('port', process.env.PORT || 8888); 

//Routes
app.use(require("./routes/index.js")); 

app.get('/login', function(req, res) {
    var scopes = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize' +
      '?response_type=code' +
      '&client_id=' + clientID +
      (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
      '&redirect_uri=' + encodeURIComponent(redirectUri));
    });

  
app.listen(app.get('port'), () => {
    console.log("server on port", app.get('port')); 
    console.log(process.env.CALLBACK_URL);
})