import Store from 'https://network-lite.nodehill.com/store';
import Game from './Game.js';
import Player from "./Player.js";
import Board from "./Board.js";


export default class Network {
  constructor() {
    this.addEventListeners();
    this.renderStart();
  }


  renderStart() {
    $('body').html(/*html*/`
      <div class="start">
        <h1>Super amazing sCRAPble</h1>
        <input type="text" name="playerName" placeholder="Name" required>
        <button class="start-btn">Get key</button>
        <button class="connect-btn">Connect</button>
      </div>
    `);
  }

  addEventListeners() {

    $('body').off('click');

    $('body').on('click', '.board > div', e =>
      this.makeMove($('.board > div').index(e.currentTarget))
    );

    const getName = () => {
      this.player = $('input[name="playerName"]').val();
      return this.playerName;
    };

    $('body').on('click', '.start-btn', async () => {
      if (!getName()) { return; }
      this.networkKey = await Store.createNetworkKey();
      $('.start').append('<p>Give your friend this network key: ' + this.networkKey + '</p><p>When he/she has entered it the games starts!</p>');
      $('.start-btn').prop('disabled', true);
      this.connectToStore();
    });

    $('body').on('click', '.connect-btn', () => {
      if (!getName()) { return; }
      this.networkKey = prompt('Enter the network key from your friend:');
      this.connectToStore();
    });

  }

  async connectToStore() {
    this.store = await Store.getNetworkStore(
      this.networkKey,
      () => this.listenForNetworkChanges()
    );

    window.store = this.store; // debug

    // Setup some properties in the store if they do not
    // exist already

    let s = this.store;
    s.playerNames = s.playerNames || [];
    s.board = s.board || ' '.repeat(9).split('');
    s.currentPlayer = 0;

    // Check that there are not two players already
    if (s.playerNames.length > 1) {
      alert('Someone else is already playing!');
      return;
    }

    // Which player am I? (0 or 1)
    this.playerIndex = s.playerNames.length;

    // Add my name
    s.playerNames.push(this.playerName);

    // Now call render to start the main game
    // if you are player 2
    if (s.playerNames.length > 1) {
      new Game().start();
    }
  }
}


