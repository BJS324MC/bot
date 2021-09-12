class API{
  constructor(token){
    this.token=token;
  }
  get(url){
    return fetch("https://en.lichess.org/api/"+url,{
      headers: {
        "Authorization": "Bearer " + this.token
      },
      method: "GET"
    }).then(a=>this.lar(a)).catch(e=>console.log(e));
  }
  post(url){
    return fetch("https://en.lichess.org/api/"+url,{
      headers: {
        "Authorization": "Bearer " + this.token
      },
      method: "POST"
    }).then(a=>this.lar(a)).catch(e=>console.log(e));
  }
  accept(challengeId){
    return this.post(`challenge/${challengeId}/accept`);
  }
  decline(challengeId){
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
  lar(a){
    console.log(JSON.stringify(a));
    return a;
  }
  stream(url, handler) {
    console.log(`GET ${url} stream`);
    oboe({
        method: "GET",
        url: "https://en.lichess.org/api/" + url,
        headers: {
          "Authorization": "Bearer " + this.token
        }
      })
      .node("!", function(data) {
        console.log("STREAM data : " + JSON.stringify(data));
        handler(data);
      }).fail(function(errorReport) {
        console.error(JSON.stringify(errorReport));
      });
    //this.get(url).then(readStream(handler));
  }
}