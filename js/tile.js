export default class Tile {
  constructor(char, points) {
    this.specialSquare;
    this.hasBeenPlaced = false;
    this.char = char;
    this.points = points;
    this.boardIndex;
  }
}
