const axios = require("axios");
const oboe = require("oboe");

class API {
  constructor(token) {
    this.token = token;
  }
  get(url) {
    return axios({
      url:`https://lichess.org/api/${url}`,
      headers: {
        "Authorization": `Bearer ${this.token}`
      },
      method: "GET"
    }).catch(e => console.error('GET '+e));
  }
  post(url,options = {}) {
    return axios({
      url:`https://lichess.org/api/${url}`,
      headers: {
        "Authorization": `Bearer ${this.token}`
      },
      data: options,
      method: "POST"
    }).catch(e => console.error('POST '+e));
  }
  accept(challengeId) {
    return this.post(`challenge/${challengeId}/accept`);
  }
  decline(challengeId) {
    return this.post(`challenge/${challengeId}/decline`);
  }
  accountInfo() {
    return this.get("account");
  }
  makeMove(gameId, move) {
    return this.post(`bot/game/${gameId}/move/${move}`);
  }
  abortGame(gameId) {
    return this.post(`bot/game/${gameId}/abort`);
  }
  resignGame(gameId) {
    return this.post(`bot/game/${gameId}/resign`);
  }
  streamEvents(handler) {
    return this.stream("stream/event", handler);
  }
  streamGame(gameId, handler) {
    return this.stream(`bot/game/stream/${gameId}`, handler);
  }
  chat(gameId, room, text) {
    return this.post(`bot/game/${gameId}/chat`, {
      room,
      text
    });
  }
  stream(url, handler) {
    oboe({
      method: "GET",
      url: `https://lichess.org/api/${url}`,
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    })
      .node("!", data => {
        console.log(`STREAM data :`,data);
        handler(data);
      }).fail(errorReport => console.error(JSON.stringify(errorReport)));
  }
}
module.exports = API;