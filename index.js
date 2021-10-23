const dotenv = require('dotenv');

dotenv.config();

const { TOKEN } = process.env;

const API = require('./main/api.js'),
      Bot = require('./main/bot.js');

const BjsBot = require('./bjsbot.js')

const bot = new Bot(new API(TOKEN), BjsBot);
bot.start();