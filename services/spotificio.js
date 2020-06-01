
const request = require("request");

class Spotificio {
  constructor() {}

  getUserInfo(accessToken) {
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

  getUserFollows(accessToken) {
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

  getArtistsAlbum(accessToken) {}
}

module.exports = Spotificio; 
