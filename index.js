const config = require("./config/index");
const express = require("express");
const cors = require("cors");
const request = require("request");
const cookieParser = require("cookie-parser");
const querystring = require("querystring");

const generateRandomString = require("./utils/generateRamdonString");
const encodeBasic = require("./utils/encodeBasic");
const scopesArray = require("./utils/scopesArray");

const app = express();
app.set("port", config.port || 8888);

app.use(cors());
app.use(cookieParser());

function getUserInfo(accessToken) {
  if (!accessToken) {
    return Promise.resolve(null);
  }

  const options = {
    url: "https://api.spotify.com/v1/me",
    headers: { Authorization: `Bearer ${accessToken}` },
    json: true,
  };

  return new Promise((resolve, reject) => {
    request.get(options, function (error, response, body) {
      if (error || response.statusCode !== 200) {
        reject(error);
      }

      resolve(body);
      //console.log(body); 
    });
  });
}

function getUserFollows(accessToken) {
  if (!accessToken) {
    return Promise.resolve(null);
  }

  const options = {
    url: "https://api.spotify.com/v1/me/following?type=artist",
    headers: { Authorization: `Bearer ${accessToken}` },
    json: true,
  };

  return new Promise((resolve, rej) => {
    request.get(options, (err, res, body) => {
      if (err || res.statusCode !== 200) {
        rej(err);
      }

      resolve(body); 
    });
  });
}

app.get("/login", function (req, res) {
  const state = generateRandomString(16);
  //console.log(state);
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

app.get("/", async (req, res, next) => {
  res.send("Hello world");
});

app.get("/following", async (req, res, next) => {
  const { access_token: accessToken } = req.cookies;
  res.send("following");
  if (!accessToken) {
    return res.redirect("/");
  }

  try {
    console.log("Hola");
    const userInfo = await getUserInfo(accessToken);
    //console.log(userInfo); 
    const userFollowing = await getUserFollows(accessToken);
    console.log(userFollowing.artists); 
   // console.log(userFollowing);
  } catch (e) {
    next(e);
  }
});

app.get("/callback", function (req, res, next) {
  const { code, state } = req.query;
  const { auth_state } = req.cookies;
  console.log(state);
  console.log(auth_state);
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

    res.cookie("access_token", body.access_token, { httpOnly: true });
    res.redirect("/following");
  });
});

app.get("/logout", function (req, res) {
  res.clearCookie("access_token");
  res.redirect("/");
});

app.listen(app.get("port"), () => {
  console.log("server on port", app.get("port"));
});
