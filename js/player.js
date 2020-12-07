export default class Player {
  constructor(game, store, name) {
    this.game = game;
    this.store = store;
    this.name = name;
    this.score = 0;
    this.stand = [...this.game.getTiles()];
  }


}
