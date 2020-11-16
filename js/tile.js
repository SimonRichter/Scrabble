export default class Tile {
  constructor(specialCharacter, boardIndex) {
    this.specialCharacter = specialCharacter;
    let hasBeenPlaced = false;
    let whichPlayerPlacedMe;
    let letter = "__";
    let points = 0;
    this.boardIndex = boardIndex;
  }
}
