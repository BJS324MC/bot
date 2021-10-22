class Game {
  constructor(api, name, engine) {
    this.api = api;
    this.name = name;
    this.engine = engine;
    this.init();
  }
  init() {
    this.engine.postMessage("setoption name Skill Level value 1")
    this.engine.addMessageListener(e => {
      console.log(this.fen);
      const data = e.split(" ")
      if (data[0] !== "bestmove") return;
      let nextMove = data[1];
      console.log(this.name + " as " + this.colour + " to move " + nextMove);
      this.api.makeMove(this.gameId, nextMove);
    })
  }
  start(gameId) {
    this.gameId = gameId;
    this.api.streamGame(gameId, (event) => this.handler(event));
  }
  handleChatLine(event) {
    if (event.username !== this.name) {
      const reply = this.engine.getReply(event);
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
    if (this.isTurn(this.colour, moves)) {
      let dt = data[chess.history()];
      if (!dt) {
        let stockfish = this.engine;
        stockfish.postMessage("position " + (this.fen === "startpos" ? "" : "fen ") + this.fen + " moves " + previousMoves);
        stockfish.postMessage("go depth 5");
        return;
      }
      let nextMove = chess.move(handleRandom(dt));
      nextMove = nextMove.from + nextMove.to;
      console.log("Table Move:" + nextMove);
      console.log(this.name + " as " + this.colour + " to move " + nextMove);
      this.api.makeMove(this.gameId, nextMove);
    }
  }
  playEngine(previousMoves) {
    const moves = (previousMoves === "") ? [] : previousMoves.split(" ");
    if (this.isTurn(this.colour, moves)) {
      let stockfish = this.engine;
      stockfish.postMessage("position " + (this.fen === "startpos" ? "" : "fen ") + this.fen + " moves " + previousMoves);
      stockfish.postMessage("go depth 12");
    }
  }
  playingAs(event) {
    return (event.white.name === this.name) ? "white" : "black";
  }

  isTurn(colour, moves) {
    var parity = moves.length % 2;
    return (colour === "white") ? (parity === 0) : (parity === 1);
  }
}