export default class Board {
  constructor() {
    // All the tiles that have been put on the board are in this array
    this.putTiles = [];
    // When a tile is placed on the board,
    // the tile object for that tile is copied into this array
    // The tile object should contain information on where
    // on the board it has been placed, for example with the
    // field boardIndex in the tile object
    this.putTilesThisRound = [];
  }

  render() {

    // All the indexes of Special Squares (pain in the a**)
    let specialSquares = {
      0: 'TW', 7: 'TW', 105: 'TW', 14: 'TW', 119: 'TW', 210: 'TW', 224: 'TW', 217: 'TW',
      20: 'TL', 76: 'TL', 80: 'TL', 24: 'TL', 84: 'TL', 88: 'TL', 136: 'TL', 140: 'TL',
      144: 'TL', 148: 'TL', 200: 'TL', 204: 'TL',
      16: 'DW', 32: 'DW', 48: 'DW', 64: 'DW', 64: 'DW', 196: 'DW', 182: 'DW', 168: 'DW',
      154: 'DW', 28: 'DW', 42: 'DW', 56: 'DW', 70: 'DW', 160: 'DW', 176: 'DW', 192: 'DW', 208: 'DW',
      3: 'DL', 36: 'DL', 45: 'DL', 52: 'DL', 92: 'DL', 96: 'DL', 108: 'DL', 11: 'DL', 38: 'DL',
      59: 'DL', 98: 'DL', 102: 'DL', 122: 'DL', 126: 'DL', 128: 'DL', 165: 'DL', 172: 'DL',
      179: 'DL', 186: 'DL', 188: 'DL', 213: 'DL', 221: 'DL', 116: 'DL', 132: 'DL',
      112: 'CS'
    }

    let board_container = $('<div class="board"/>').appendTo('body');
    let buildBoard = () => {
      let bs = 15;
      let squareIdx = 0; // counter that will go from 0 -224
      for (let i = 0; i < bs; i++) {
        if ($(board_container).html()) { //html will replace any element (similar to .text)
          $(board_container).html($(board_container).html());
        }
        for (let j = 0; j < bs; j++) {
          let specialS = specialSquares[squareIdx];
          if (specialS) {
            $(board_container).append(`<div id='cell${squareIdx}' class='${specialS}'>${specialS}</div>`);  // Appened ID to cells and CSS class
          } else {
            $(board_container).append(`<div id='cell_${squareIdx}'></div>`);   // we will use the ID of the cell later to identfy and select the square
          }
          squareIdx++;
        }
      }
    }

    buildBoard();
  }

  checkXYAxis() {
    // First we hopefully sort the putTilesThisRound array so that the tile with
    // the lowest index number on the board is first and the tile
    // with the highest index number on the board is last
    // This is to make sure the function is "reading" the word
    // correctly no matter what order the player puts down the tiles
    putTilesThisRound.sort((a, b) => a.boardIndex - b.boardIndex);
    // Case if the word is two letters long:
    if (putTilesThisRound.length === 2) {
      if (
        putTilesThisRound[0].boardIndex ===
        putTilesThisRound[1].boardIndex - 15 ||
        putTilesThisRound[0].boardIndex === putTilesThisRound[1].boardIndex - 1
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
      putTilesThisRound[0].boardIndex ===
      putTilesThisRound[1].boardIndex - 15
    ) {
      for (let i = 0; i < putTilesThisRound.length; i++) {
        // We use the code in the next if statement until we reach the last letter
        if (i < putTilesThisRound.length - 1) {
          if (
            putTilesThisRound[i].boardIndex ===
            putTilesThisRound[i + 1].boardIndex - 15
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
            putTilesThisRound[i].boardIndex ===
            putTilesThisRound[i + 1].boardIndex - 15
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
      putTilesThisRound[0].boardIndex ===
      putTilesThisRound[1].boardIndex - 1
    ) {
      for (let i = 0; i < putTilesThisRound.length; i++) {
        // We use the code in the next if statement until we reach the last letter
        if (i < putTilesThisRound.length - 1) {
          if (
            putTilesThisRound[i].boardIndex ===
            putTilesThisRound[i + 1].boardIndex - 1
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
            putTilesThisRound[i].boardIndex ===
            putTilesThisRound[i + 1].boardIndex - 1
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
}
