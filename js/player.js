export default class Player {

  constructor(game, name) {
    this.game = game;
    this.name = name;
    this.tiles = [...this.game.getTiles(), ' '];
  }

  render() {
    return `<div class="stand">
      ${this.tiles.map((x, i) => `<div 
          class="tile ${x.char ? '' : 'none'}"
          data-player="${this.game.players.indexOf(this)}"
          data-tile="${i}"
        >
        ${x.char || ''}
        <span>${x.points || ''}</span>
      </div>`).join('')}
      </div>
      <div class="pname">${this.name}</div>
      `;
  }

}