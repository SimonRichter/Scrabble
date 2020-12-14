import Store from 'https://network-lite.nodehill.com/store';


export default class Network {
  constructor() {
    this.addEventListeners();
    this.renderStart();
  }


  renderStart() {
    $('body').html(/*html*/`
      <div class="start">
        <h1>Super amazing Scrabble</h1>
        <input type="text" name="playerName" placeholder="Name" required>
      </div>
    `);
  }

  addEventListeners() {

    $('body').off('click');

    const getName = () => {
      this.playerName = $('input[name="playerName"]').val();
      return this.playerName;
    };

    $('body').on('click', '.newgame', async () => {
      if (!getName()) { return; }
      this.networkKey = await Store.createNetworkKey();
      $('.start').append('<p style="title">get key ' + this.networkKey + '</p>');
      $('.start-btn').prop('disabled', true);
      this.willCreateGame = false;
      this.waitForNameToBeSaved = true;
      await this.connectToStore();
      let s = this.store;
      s.playerNames = s.playerNames || [];
      // Add my name
      s.playerNames.push(this.playerName);
      // Which player am I? (0 or 1)
      this.playerIndex = s.playerNames.length;
      this.waitForNameToBeSaved = false;
    });

    $('body').on('click', '.joingame', () => {
      if (!getName()) { return; }
      this.networkKey = prompt('Enter the network key from your friend:');
      this.willCreateGame = true;
      this.waitForNameToBeSaved = true;
      game.start();
    });

  }

  listenForNetworkChanges() {
    if (this.playerNames.length > 3) {
      alert('Four players are already playing!');  // TODO: Make a nicer looking alert maybe
      return;
    }
    if (this.playerNames.length > 1 && this.willCreateGame === false) {
      $('body').html("");
      this.game.startWithStoreParameters();
      this.willCreateGame = true;
    }
    // this method is called each time someone else
    // changes this.store
    if (this.waitForNameToBeSaved === false) {
      this.game.board = this.store.board;
      this.bag.tiles = this.store.bag.tiles;
      this.game.players = this.store.players;
      this.game.playerTurn = this.store.playerTurn;
      this.skipCounter = this.store.skipCounter;
      this.game.board.render();
      this.renderTilesLeft();
      if (this.game.playerTurn === this.playerIndex) {
        this.game.renderStand(); // We might get too many active drag events..? 
      }
      if (this.store.gameOver = true && !(this.playerIndex === this.store.playerTurn)) {
        this.game.renderGameOver();
      }
    }
  }

  async connectToStore() {
    this.store = await Store.getNetworkStore(
      this.networkKey,
      () => this.listenForNetworkChanges()
    );

    // Now call render to start the main game
    // if you are player 2

  }
}


