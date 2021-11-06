class Game {
  constructor(api, name, engine) {
    this.api = api;
    this.name = name;
    this.engine = engine;
    this.init();
  }
  init() {
    this.engine.onmessage = move => {
      console.log(`${this.name} as ${this.colour} played ${move}`);
      this.api.makeMove(this.gameId, move);
    };
  }
  start(gameId) {
    this.gameId = gameId;
    this.api.streamGame(gameId, event => this.handler(event));
  }
  handleChatLine(event) {
    if (event.username !== this.name) {
      const reply = this.engine.getReply(event.text);
      if (reply) this.api.chat(this.gameId, event.room, reply);
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
        this.playNextMove(event.state.moves,event.state.wtime,event.state.btime);
        break;
      case "gameState":
        this.playNextMove(event.moves,event.wtime,event.btime);
        break;
      default:
        console.log("Unhandled game event");
    }
  }

  playNextMove(previousMoves,wtime,btime) {
    const moves = (previousMoves === "") ? [] : previousMoves.split(" ");
    if (this.isTurn(this.colour, moves))
      this.engine.message(this.fen, moves, wtime, btime);
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