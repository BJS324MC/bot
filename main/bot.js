const Game = require('./game.js');

class Bot {
  constructor(api, engine) {
    this.api = api;
    this.engine = engine;
    this.start = this.start.bind(this);
    this.handleChallenge = this.handleChallenge.bind(this);
  }
  async start() {
    this.account = (await this.api.accountInfo()).data;
    console.log("Playing as " + this.account.username);
    this.api.streamEvents(event => this.eventHandler(event));
    return this.account;
  }

  eventHandler(event) {
    switch (event.type) {
      case "challenge":
        this.handleChallenge(event.challenge);
        break;
      case "gameStart":
        this.handleGameStart(event.game.id);
        break;
      default:
        console.log("Unhandled event");
    }
  }

  handleGameStart(id) {
    const game = new Game(this.api, this.account.username, new this.engine());
    game.start(id);
  }

  async handleChallenge(challenge) {
    if (challenge.rated) {
      console.log("Accepting rated challenge from " + challenge.challenger.id);
      const response = await this.api.accept(challenge.id);
      console.log("Accepting", response.data || response);
    }
    else {
      console.log("Accepting unrated challenge from " + challenge.challenger.id);
      const response = await this.api.accept(challenge.id);
      console.log("Accepted", response.data || response);
    }
  }
}

module.exports = Bot;