const dotenv = require('dotenv');

dotenv.config();

const { TOKEN } = process.env;

const { getPgn } = require("./main/util.js");

const bot = new Bot(new API(TOKEN), "stockfish/stockfish.js");
bot.start();
getPgn("pgn/lichess/Handakuten.pgn")
getPgn("pgn/lichess/Bjs324Chess.pgn")
getPgn("pgn/chess.com/0.pgn")
getPgn("pgn/chess.com/1.pgn")
getPgn("pgn/chess.com/2.pgn")
getPgn("pgn/chess.com/3.pgn")
getPgn("pgn/chess.com/5.pgn")