const request = require("request");

class Spotificio {
  constructor() {}

  getUserInfo(accessToken) {
    if (!accessToken) {
      return Promise.resolve(null);
    }

    const link = "https://api.spotify.com/v1/me"; 
    return new Promise((resolve, rej) => {
        this.getQuery(link, accessToken).then((res) => {
          resolve(res);
        });
      });
  }

  getUserFollows(accessToken) {
    if (!accessToken) {
      return Promise.resolve(null);
    }
    const link = "https://api.spotify.com/v1/me/following?type=artist";

    return new Promise((resolve, rej) => {
      this.getQuery(link, accessToken).then((res) => {
        resolve(res);
      });
    });
  }

  getArtistsAlbums(accessToken, artistId) {
    if (!accessToken) {
      return Promise.resolve(null);
    }
    const link = `https://api.spotify.com/v1/artists/${artistId}/albums`;
    return new Promise((resolve, rej) => {
      this.getQuery(link, accessToken).then((res) => {
        resolve(res);
      });
    });
  }

  getQuery(link, token) {
    const options = {
      url: link,
      headers: { Authorization: `Bearer ${token}` },
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
}

module.exports = Spotificio;
