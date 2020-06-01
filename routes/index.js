//utilizado para almacenar las rutas principales
const express = require("express");
const request = require('request'); 
const Spotificio = require('../services/spotificio');
const generateRandomString = require("../utils/generateRamdonString");
const scopesArray = require("../utils/scopesArray");
const querystring = require("querystring");
const encodeBasic = require('../utils/encodeBasic'); 
const router = express.Router();


const spotify = new Spotificio(); 

router.get("/", async (req, res, next) => {
  res.send("Hello world");
});

router.get("/login", function (req, res) {
    const state = generateRandomString(16);
 
    const queryString = querystring.stringify({
      response_type: "code",
      client_id: process.env.CLIENT_ID,
      scope: scopesArray.join(" "),
      redirect_uri: process.env.CALLBACK_URL,
      state: state,
    });
    
    res.cookie("auth_state", state, { httpOnly: true });
    res.redirect(`https://accounts.spotify.com/authorize?${queryString}`);
  });

router.get("/following", async (req, res, next) => {
  const { access_token: accessToken } = req.cookies;
  res.send("following");
  if (!accessToken) {
    return res.redirect("/");
  } 

  try {
//0RqtSIYZmd 4fiBKVFqyIqD
    const userInfo = await spotify.getUserInfo(accessToken);
    //console.log(userInfo);
    const userFollowing = await spotify.getUserFollows(accessToken);
    //console.log(userFollowing.artists.items[0].id);
    const followedAlbums = await spotify.getArtistsAlbums(accessToken, userFollowing.artists.items[1].id)
    console.log(followedAlbums); 
  
  } catch (e) {
    next(e);
  }
});

router.get("/callback", function (req, res, next) {
  const { code, state } = req.query;
  const { auth_state } = req.cookies;
  //console.log(auth_state); 
  if (state === null || state !== auth_state) {
    next(new Error("The state doesn't match"));
  }
  
  res.clearCookie("auth_state");
 
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri: process.env.CALLBACK_URL,
      grant_type: "authorization_code",
    },
    headers: {
      Authorization: `Basic ${encodeBasic(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET
      )}`,
    },
    json: true,
  };
  
 request.post(authOptions, function (error, response, body) {
    if (error || response.statusCode !== 200) {
      next(new Error("The token is invalid"));
    }
    console.log("pase")
    res.cookie("access_token", body.access_token, { httpOnly: true });
    res.redirect("/following");
  });
});

router.get("/logout", function (req, res) {
  res.clearCookie("access_token");
  res.redirect("/");
});

module.exports = router;
