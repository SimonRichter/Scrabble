import Store from 'https://network-lite.nodehill.com/store';
import Board from "./Board.js";

export default class Network {

  constructor(board) {
    this.renderStart();
    this.addEventListeners();
    this.board = board;
  }

  renderStart() {

    $('body').html(/*html*/`
        <input type="text" name="playerName" placeholder="Name" required>
        <button class="start-btn">Start a new game</button>
        <button class="connect-btn">Connect to a game</button>
    `);
  }

  render() {

    let s = this.store;
    let name = s.playerNames[s.currentPlayer];
    $('body').html(/*html*/`
      <div class="board">
        ${s.board.map(item => `
            <div>${item}</div>
        `).join('')}
      </div>
      <div class="turn">&nbsp;&nbsp;
        ${this.winMessage || (
        this.playerIndex === s.currentPlayer ? 'My turn' : 'Waiting for ' + name)}
      </div>
    `);
  }

  addEventListeners() {
    $('body').off('click');
    $('body').on('click', '.board > div', e =>
      this.makeMove($('.board > div').index(e.currentTarget))
    );

    const getName = () => {
      this.playerName = $('input[name="playerName"]').val();
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
    console.log("im in the store");

    this.store = await Store.getNetworkStore(
      this.networkKey,
      () => this.listenForNetworkChanges()
    );

    window.store = this.store; // debug
    // Setup some properties in the store if they do not
    // exist already
    let s = this.store;
    s.playerNames = s.playerNames || [];
    s.currentPlayer = 0;

    // Check that there are not two players already

    if (s.playerNames.length > 6) {
      alert('Someone else is already playing!');
      return;
    }
    // Which player am I? (0 or 1)
    this.playerIndex = s.playerNames.length;
    // Add my name
    s.playerNames.push(this.playerName);
    // Now call render to start the main game
    // if you are player 2
    if (s.playerNames.length > 5) {
    }

  }

  listenForNetworkChanges() {
    // this method is called each time someone else
    // changes this.store
    console.log("something changed. function listenForNetworkChanges() ")
    this.board.render();

  }

}