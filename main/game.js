class Game {
  constructor(api, name, engine) {
    this.api = api;
    this.name = name;
    this.engine = engine;
    this.init();
  }
  init() {
    this.engine.onmessage = move => {
      console.log(`${this.name} as ${this.colour} to move ${move}`);
      this.api.makeMove(this.gameId, move);
    };
  }
  start(gameId) {
    this.gameId = gameId;
    this.api.streamGame(gameId, event => this.handler(event));
  }
  handleChatLine(event) {
    if (event.username !== this.name) {
      const reply = "idk";
      if (reply) {
        this.api.chat(this.gameId, event.room, reply);
      }
    }
  }

  handler(event) {
    switch (event.type) {
      case "chatLine":
        this.handleChatLine(event);
        break;
      case "gameFull":
        this.colour = this.playingAs(event);
        this.fen = event.initialFen;
        this.playNextMove(event.state.moves);
        break;
      case "gameState":
        console.log(event);
        this.playNextMove(event.moves);
        break;
      default:
        console.log("Unhandled game event : " + JSON.stringify(event));
    }
  }

  playNextMove(previousMoves) {
    const moves = (previousMoves === "") ? [] : previousMoves.split(" ");
    if (this.isTurn(this.colour, moves))
      this.engine.message(this.fen, moves);
  }
  playingAs(event) {
    return (event.white.name === this.name) ? "white" : "black";
  }

  isTurn(colour, moves) {
    var parity = moves.length % 2;
    return (colour === "white") ? (parity === 0) : (parity === 1);
  }
}
module.exports = Game;