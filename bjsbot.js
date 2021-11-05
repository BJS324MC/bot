const { Chess } = require('chess.js');
const Stockfish = require("./stockfish/stockfish.js");
const { createTable, handleRandom } = require('./main/util.js');

class BjsBot {
    constructor() {
        Stockfish().then(stockfish => {
            this.stockfish = stockfish;
            stockfish.addMessageListener(e => {
                if (typeof e !== "string") return;
                const data = e.split(" ");
                if (data[0] === "bestmove") this.onmessage(data[1]);
            });
        });
        this.chess = new Chess();
        this.book = createTable(
            ["lichess/Handakuten.pgn",
                "lichess/Bjs324Chess.pgn",
                "chess.com/0.pgn",
                "chess.com/1.pgn",
                "chess.com/2.pgn",
                "chess.com/3.pgn",
                "chess.com/4.pgn"]
        );
    }
    message(fen, moves, wtime, btime) {
        const { stockfish, chess, book } = this;
        chess.load(fen);
        moves.forEach(move => this.chess.move(move, { sloppy: true }));
        const bookMoves = book[handleRandom(chess.history())];
        if (bookMoves) {
            const nextMove = chess.move(handleRandom(bookMoves));
            this.onmessage(nextMove.from + nextMove.to);
        }
        else {
            stockfish.postMessage(`position ${fen === "startpos" ? "" : "fen "}${fen} moves ${moves.join(" ")} wtime ${wtime} btime ${btime}`);
            stockfish.postMessage("go depth 15");
        }
    }
}

module.exports = BjsBot;