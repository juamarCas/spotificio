require('dotenv').config();

const config = {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    spotifyClient: process.env.SPOTIFY_TOKEN, 
    port: process.env.PORT,
    callbackUrl: process.env.CALLBACK_URL
}

module.exports = {
    config
}; 