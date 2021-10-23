const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const oboe = require("oboe");

class API {
  constructor(token) {
    this.token = token;
  }
  get(url) {
    return fetch(`https://lichess.org/api/${url}`, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      },
      method: "GET"
    }).then(a => this.lar(a)).catch(e => console.log(e));
  }
  post(url) {
    return fetch(`https://lichess.org/api/${url}`, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      },
      method: "POST"
    }).then(a => this.lar(a)).catch(e => console.log(e));
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
  lar(a) {
    console.log(JSON.stringify(a));
    return a;
  }
  stream(url, handler) {
    console.log(`GET ${url} stream`);
    oboe({
      method: "GET",
      url: `https://lichess.org/api/${url}`,
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    })
      .node("!", data => {
        console.log(`STREAM data : ${JSON.stringify(data)}`);
        handler(data);
      }).fail(errorReport => console.error(JSON.stringify(errorReport)));
  }
}
module.exports = API;