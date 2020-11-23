import SAOLchecker from "./SAOLchecker.js";

export default class Board {
  constructor() {
    // When the game starts, first round is true. When checkMiddleSquare() is called, it changes to false.
    // (May have to be moved to game?)
    this.firstRound = true;
    // All the tiles that have been put on the board are in this array
    this.putTiles = [];
    // When a tile is placed on the board,
    // the tile object for that tile is copied into this array
    // The tile object should contain information on where
    // on the board it has been placed, for example with the
    // field boardIndex in the tile object
    this.putTilesThisRound = [];

    this.specialSquares = {
      // Triple Word pts
      0: "TW",
      7: "TW",
      14: "TW",
      105: "TW",
      119: "TW",
      210: "TW",
      217: "TW",
      224: "TW",
      // Triple letter pts
      20: "TL",
      24: "TL",
      76: "TL",
      80: "TL",
      84: "TL",
      88: "TL",
      136: "TL",
      140: "TL",
      144: "TL",
      148: "TL",
      200: "TL",
      204: "TL",
      //Double Word pts
      16: "DW",
      32: "DW",
      48: "DW",
      64: "DW",
      64: "DW",
      196: "DW",
      182: "DW",
      168: "DW",
      154: "DW",
      28: "DW",
      42: "DW",
      56: "DW",
      70: "DW",
      160: "DW",
      176: "DW",
      192: "DW",
      208: "DW",

      //Double letter pts
      3: "DL",
      36: "DL",
      45: "DL",
      52: "DL",
      92: "DL",
      96: "DL",
      108: "DL",
      11: "DL",
      38: "DL",
      59: "DL",
      98: "DL",
      102: "DL",
      122: "DL",
      126: "DL",
      128: "DL",
      165: "DL",
      172: "DL",
      179: "DL",
      186: "DL",
      188: "DL",
      213: "DL",
      221: "DL",
      116: "DL",
      132: "DL",

      112: "CS", // Middle of the board
    };
  }
  createBoard() {
    this.matrix = [...new Array(15)].map((x) =>
      [...new Array(15)].map((x) => ({}))
    );
    let squareIdx = 0; // counter that will go from 0 - 224
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        let specialS = this.specialSquares[squareIdx];
        if (specialS) {
          this.matrix[i][j].specialS = specialS; // added special square to exact position(x,y)
          this.matrix[i][j].index = squareIdx;
        } else {
          this.matrix[i][j].index = squareIdx;
        }
        squareIdx++;
      }
    }
  }

  render() {
    $(".board").remove();
    $("body").append('<div class="board"/>');
    $(".board").html(
      this.matrix
        .flat()
        .map(
          (x) => `
        <div class="${x.specialS ? x.specialS : ""}" data-index='${x.index
            }' id='cell${x.index}'>
          ${x.tile
              ? `<div class="tile${x.tile.hasBeenPlaced ? "" : " tilePlacedThisRound"
              }" data-index='${x.index}'>${x.tile.char} <span>${x.tile.points || ""
              }</span></div>`
              : `${x.specialS ? x.specialS : ""}`
            }
        </div>
      `
        )
        .join("")
    );
    console.log(this.matrix); // it shows the matrix on the Console

    // Temporary
    if (this.putTilesThisRound.length) console.log('true or false? ', this.checkIfWord());
  }

  checkXYAxis() {
    let firstIndexInRow = [
      0,
      15,
      30,
      45,
      60,
      75,
      90,
      105,
      120,
      135,
      150,
      165,
      180,
      195,
      210,
    ];
    // First we hopefully sort the this.putTilesThisRound array so that the tile with
    // the lowest index number on the board is first and the tile
    // with the highest index number on the board is last
    // This is to make sure the function is "reading" the word
    // correctly no matter what order the player puts down the tiles
    this.putTilesThisRound.sort((a, b) =>
      a.boardIndex > b.boardIndex ? 1 : -1
    );
    // Case if the word is two letters long:
    if (this.putTilesThisRound.length === 2) {
      if (
        this.putTilesThisRound[0].boardIndex ===
        this.putTilesThisRound[1].boardIndex - 15 ||
        (this.putTilesThisRound[0].boardIndex ===
          this.putTilesThisRound[1].boardIndex - 1 &&
          !firstIndexInRow.includes(this.putTilesThisRound[1].boardIndex))
      ) {
        return true;
      } else {
        alert(
          "You did not put down your tiles next to eachother. Please try again."
        );
        return false;
      }
    }
    // Case if the word is vertically placed on the board
    // First we check if the second letter is below the first one
    else if (
      this.putTilesThisRound[0].boardIndex ===
      this.putTilesThisRound[1].boardIndex - 15
    ) {
      for (let i = 0; i < this.putTilesThisRound.length - 1; i++) {
        // We use the code in the next if statement until we reach the last letter
        if (i < this.putTilesThisRound.length - 2) {
          if (
            this.putTilesThisRound[i].boardIndex ===
            this.putTilesThisRound[i + 1].boardIndex - 15
          ) {
            // It's a match so we move on to the next letter
            continue;
          } else {
            alert(
              "You did not put down your tiles next to eachother. Please try again."
            );
            return false;
          }
          // When we have reached the last letter we do one final check
        } else {
          if (
            this.putTilesThisRound[i].boardIndex ===
            this.putTilesThisRound[i + 1].boardIndex - 15
          ) {
            return true;
          } else {
            alert(
              "You did not put down your tiles next to eachother. Please try again."
            );
            return false;
          }
        }
      }
    }
    // Case if the word is horizontally placed on the board
    // First we check if the second letter is to the right of the first one
    else if (
      this.putTilesThisRound[0].boardIndex ===
      this.putTilesThisRound[1].boardIndex - 1 &&
      !firstIndexInRow.includes(this.putTilesThisRound[1].boardIndex)
    ) {
      for (let i = 0; i < this.putTilesThisRound.length - 1; i++) {
        // We use the code in the next if statement until we reach the last letter
        if (i < this.putTilesThisRound.length - 2) {
          if (
            this.putTilesThisRound[i].boardIndex ===
            this.putTilesThisRound[i + 1].boardIndex - 1 &&
            !firstIndexInRow.includes(this.putTilesThisRound[i + 1].boardIndex)
          ) {
            // It's a match so we move on to the next letter
            continue;
          } else {
            alert(
              "You did not put down your tiles next to eachother. Please try again."
            );
            return false;
          }
          // When we have reached the last letter we do one final check
        } else {
          if (
            this.putTilesThisRound[i].boardIndex ===
            this.putTilesThisRound[i + 1].boardIndex - 1 &&
            !firstIndexInRow.includes(this.putTilesThisRound[i + 1].boardIndex)
          ) {
            return true;
          } else {
            alert(
              "You did not put down your tiles next to eachother. Please try again."
            );
            return false;
          }
        }
      }
    } else {
      alert(
        "You did not put down your tiles next to eachother. Please try again."
      );
      return false;
    }
  }

  nextToPutTiles() {
    // Compares all the newly placed tiles to the old (already placed) tiles
    for (let newTile of this.putTilesThisRound) {
      for (let oldTile of this.putTiles) {
        // If the newly placed tile is in the square under or above the old tile, function returns true
        if (
          oldTile.boardIndex === newTile.boardIndex - 15 ||
          oldTile.boardIndex === newTile.boardIndex + 15
        ) {
          return true;
        }
        // If the newly placed tile is in the square to the left or right of the old tile, function returns true
        else if (
          oldTile.boardIndex === newTile.boardIndex + 1 ||
          oldTile.boardIndex === newTile.boardIndex - 1
        ) {
          return true;
        } else {
          // If it's the last tile of the putTilesThisRoundArray (not 100% sure if pop works here)
          if (newTile === this.putTilesThisRound.pop()) {
            alert(
              "You need to connect your tiles with another already placed tile on the board."
            );
            return false;
          } else {
            continue;
          }
        }
      }
    }
  }

  checkMiddleSquare() {
    // If the first round is being played
    if (this.firstRound) {
      let temp = 0;
      for (let tile of this.putTilesThisRound) {
        // If one of the newly placed tiles is on the middle square, function returns true
        if (tile.boardIndex === 112) {
          this.firstRound = false;
          return true;
        } else {
          // Checks if the loop is on the last tile in the putTilesThisRound array
          if (temp === this.putTilesThisRound.length - 1) {
            alert(
              "You must place one of your tiles in the middle of the board."
            );
            return false;
          }
        }
        temp++;
      }
    } else {
      return true;
    }
  }

  async checkIfWord() {
    /*  for (let i = 0; i < this.putTilesThisRound.length; i++) {
  
      }*/
    let newTiles = this.putTilesThisRound.sort((a, b) => a.boardIndex > b.boardIndex ? 1 : -1);
    //console.log(newTiles); 
    let word = '';
    for (let i = 0; i < newTiles.length; i++) {
      word += newTiles[i].char;
    }
    console.log('word: ', word)
    let b = await SAOLchecker.scrabbleOk(word);
    console.log('b: ', b);
    return b;

  }

}
