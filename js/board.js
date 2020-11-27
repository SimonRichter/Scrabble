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
    this.falseCounter = 0;
    this.specialSquares = {
      // Triple Word pts
      0: "TW", 7: "TW", 14: "TW", 105: "TW", 119: "TW", 210: "TW", 217: "TW", 224: "TW",

      // Triple letter pts
      20: "TL", 24: "TL", 76: "TL", 80: "TL", 84: "TL", 88: "TL", 136: "TL", 140: "TL", 144: "TL", 148: "TL", 200: "TL", 204: "TL",

      //Double Word pts
      16: "DW", 32: "DW", 48: "DW", 64: "DW", 64: "DW", 196: "DW", 182: "DW", 168: "DW", 154: "DW", 28: "DW", 42: "DW", 56: "DW",
      70: "DW", 160: "DW", 176: "DW", 192: "DW", 208: "DW",

      //Double letter pts
      3: "DL", 36: "DL", 45: "DL", 52: "DL", 92: "DL", 96: "DL", 108: "DL", 11: "DL", 38: "DL", 59: "DL", 98: "DL", 102: "DL", 122: "DL",
      126: "DL", 128: "DL", 165: "DL", 172: "DL", 179: "DL", 186: "DL", 188: "DL", 213: "DL", 221: "DL", 116: "DL", 132: "DL",

      // Middle of the board
      112: "CS",
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
    // Remove the old board div and its children
    $(".board").remove();
    // Append new board div
    $("body").append('<div class="board"/>');
    // Fill the new board div with square children, some with tiles some not
    $(".board").html(
      this.matrix
        .flat()
        .map(
          // add special characters to squares that should have special characters
          // add index and an id to each square div
          (x) => `
        <div class="${x.specialS ? x.specialS : ""}" data-index='${x.index
            }' id='cell${x.index}'>
          ${
            // Then add the tiles that have been placed
            x.tile
              ? `<div class="tile${
              // remove the tilePlacedThisRound class from tiles placed in previous round
              x.tile.hasBeenPlaced ? "" : " tilePlacedThisRound"
              }" data-index='${x.index}'>${x.tile.char} <span>${
              // Add index, letter and points to the tile div
              x.tile.points || ""
              }</span></div>`
              : `${x.specialS ? x.specialS : ""}`
            }
        </div>
      `
        )
        // make sure it will be added as one string and not as individual strings
        .join("")
    );
  }

  checkXYAxisHM() {
    if (this.putTilesThisRound.length) { // Only do the function if there are tiles on the board
      let message = "Your tiles must touch each other."; // Alert message
      let tilesInOrder = this.putTilesThisRound.sort((a, b) => a.boardIndex > b.boardIndex ? 1 : -1); // Sort this.putTilesThisRound
      let startIndex = tilesInOrder[0].boardIndex; // Index of the tile with the lowest index
      let endIndex = tilesInOrder[tilesInOrder.length - 1].boardIndex; // Index of the tile with the highest index

      // Converting indexes to x and y-indexes
      let yStartIndex = Math.floor(startIndex / 15);
      let xStartIndex = startIndex % 15;
      let yEndIndex = Math.floor(endIndex / 15);
      let xEndIndex = endIndex % 15;

      if (xStartIndex !== xEndIndex) { // If tiles are in the same row
        // Check if there are any gaps between the first and last tile
        // if so return false + message
        while (xStartIndex <= xEndIndex) {
          if (!this.matrix[yStartIndex][xStartIndex].tile) { alert(message); return false; }
          xStartIndex++;
        }
      }
      if (yStartIndex !== yEndIndex) { // Same as before but in columns
        while (yStartIndex <= yEndIndex) {
          if (!this.matrix[yStartIndex][xStartIndex].tile) { alert(message); return false; }
          yStartIndex++;
        }
      }
    }
    return true;
  }

  nextToPutTilesHM() {
    if (!this.putTiles.length) {
      return true;
    }
    for (let newTile of this.putTilesThisRound) {
      for (let oldTile of this.putTiles) {
        let newX = Math.floor(newTile.boardIndex / 15);
        let newY = newTile.boardIndex % 15;
        let oldX = Math.floor(oldTile.boardIndex / 15);
        let oldY = oldTile.boardIndex % 15;

        // console.log("x and y:s", newX, newY, oldX, oldY); //test

        if (Math.abs(oldX - newX) === 1 && oldY === newY) {
          //console.log("Same axis Y, touching Y"); //test
          return true;
        }
        if (Math.abs(oldY - newY) === 1 && oldX === newX) {
          //console.log("Same axis X, touching X"); //test
          return true;
        } else {

        }
      }
    }
    alert("Tiles must touch tiles placed in previous rounds");
    return false;
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

  /*
  This method will check all potential words(strings) across the X axis 
      W      W      W
     [O] [R][O] [R][W][][][]  <---- X AXIS
      R      R      O
      D      D      R
      ??     ??     D ??
  and return an array of strings ("potencial words")
  */

  findWordsAcrossXaxis() {
    let s = "";    // this will form a a string(potential word).
    let string = []; //this array will contain the tiles found on the board.
    let strings = []; // array with all the potential words.
    for (let t of this.putTilesThisRound) {  //for all tiles put on this round.
      let yIndex = Math.floor(t.boardIndex / 15);  //obtain (x,y) coordinates
      let xIndex = t.boardIndex % 15;
      try {
        while (this.matrix[yIndex][xIndex].tile) {    // while the tile object exist on the board
          string.push(this.matrix[yIndex][xIndex].tile); //put it in the array of tiles.
          yIndex++;                                     // we move 1 sqaure and check again (while loop)
        }

      } catch (error) {    // we were at the edge of the board, catch the error and
        yIndex--;           // back one square.

      }
      yIndex = Math.floor(t.boardIndex / 15) - 1;
      try {
        while (this.matrix[yIndex][xIndex].tile) {        // we do the same as the other 
          string.push(this.matrix[yIndex][xIndex].tile);   // while-loop but now on the other
          yIndex--;                                     // direction.
        }

      } catch (error) {        // catch edge of the board error
        yIndex++;
      }

      string.sort((a, b) => a.boardIndex > b.boardIndex ? 1 : -1);  //we sort the tiles by index so we can read (left to right // top to bottom)
      for (let letter of string) {  //for each letter inside the tile
        s += letter.char;  // we add that tile to or "potential word" variable.
      }
      strings.push(s);  // pushed the potencial word to the Array which will be  returned
      s = '';    // empty the potencial word so we can use it again in the next loop.
      string = []; // empty the array of tiles  we can use it again in the next loop.
    }
    //now delete duplicated strings/words.
    let uniqueStrings = []; // Empty array for Unique words.
    $.each(strings, (i, el) => { //function for each element(potential word) of array strings.
      if ($.inArray(el, uniqueStrings) === -1) // if the element is NOT in our new uniqueStrings Array
        uniqueStrings.push(el); // push it haaaard.
    });
    console.log("strings across X:", strings); //test
    console.log("unique Strings across X", uniqueStrings)  //  test 
    return uniqueStrings; //we now return unique values /strings/potencial words
  }


  /*
  
  This method will check all potential words(strings) across the Y axis
    W O [R]R D ??
        [A]
    W O [R]R D  ??
        [A]
       W[O]R D  ??
        [A]
        []
        []
        Y 
        |
        |
        AXIS
  
  and return an array of strings ("potencial words")
  
   THE SAME AS LAST METHOD ******   findWordsAcrossXaxis()  *******
   But now for the Y axis.
  
  */
  findWordsAcrossYaxis() {
    let s = "";
    let string = [];
    let strings = [];
    for (let t of this.putTilesThisRound) {
      let yIndex = Math.floor(t.boardIndex / 15);
      let xIndex = t.boardIndex % 15;

      try {
        while (this.matrix[yIndex][xIndex].tile) {
          string.push(this.matrix[yIndex][xIndex].tile);
          xIndex++;
        }

      } catch (error) {
        xIndex--;

      }
      xIndex = (t.boardIndex % 15) - 1;
      try {
        while (this.matrix[yIndex][xIndex].tile) {
          string.push(this.matrix[yIndex][xIndex].tile);
          xIndex--;
        }

      } catch (error) {
        xIndex++;

      }
      string.sort((a, b) => a.boardIndex > b.boardIndex ? 1 : -1);
      for (let letter of string) {
        s += letter.char;
      }

      strings.push(s);
      s = '';
      string = [];
    }
    let uniqueStrings = [];
    $.each(strings, (i, el) => {
      if ($.inArray(el, uniqueStrings) === -1)
        uniqueStrings.push(el);
    });
    console.log("strings across Y:", strings);//test
    console.log("unique Strings across Y", uniqueStrings)  //test
    return uniqueStrings;
  }




  // array of potencial words from methods  findWordsAcrossYaxis() and
  // findWordsAcrossXaxis() 

  async checkIfWord(array) {

    let word = ""; // we will put each potencial word of the array here.
    for (let ord of array) {
      if (ord.length > 1) {  // words consisted of 1 letter are not considered
        word = ord;
        this.falseCounter = (await SAOLchecker.scrabbleOk(word)) ? 0 : 1;  // checks the dictionary
        if (this.falseCounter === 1) {
          alert("'" + word.toUpperCase() + "' is NOT a correct word from the Swedish dictionary!");
          break;
        }
      }

    }
  }
}
