import SAOLchecker from "./SAOLchecker.js";
import Game from "./game.js";
export default class Board {

  constructor() {
    // When the game starts, first round is true. When checkMiddleSquare() is called, it changes to false.
    // (May have to be moved to game?)
    this.firstRound = true;
    // All the tiles that have been put on the board are in this array
    this.putTiles = [];
    this.goodTimeTorenderwords = false;
    // When a tile is placed on the board,
    // the tile object for that tile is copied into this array
    // The tile object should contain information on where
    // on the board it has been placed, for example with the
    // field boardIndex in the tile object
    this.putTilesThisRound = [];
    this.falseCounter = 0;
    this.wordsPlayed = []; // correct words played this game.
    this.specialSquares = {
      // Triple Word pts
      0: "TO", 7: "TO", 14: "TO", 105: "TO", 119: "TO", 210: "TO", 217: "TO", 224: "TO",

      // Triple letter pts
      20: "TB", 24: "TB", 76: "TB", 80: "TB", 84: "TB", 88: "TB", 136: "TB", 140: "TB", 144: "TB", 148: "TB", 200: "TB", 204: "TB",

      //Double Word pts
      16: "DO", 32: "DO", 48: "DO", 64: "DO", 64: "DO", 196: "DO", 182: "DO", 168: "DO", 154: "DO", 28: "DO", 42: "DO", 56: "DO",
      70: "DO", 160: "DO", 176: "DO", 192: "DO", 208: "DO",

      //Double letter pts
      3: "DB", 36: "DB", 45: "DB", 52: "DB", 92: "DB", 96: "DB", 108: "DB", 11: "DB", 38: "DB", 59: "DB", 98: "DB", 102: "DB", 122: "DB",
      126: "DB", 128: "DB", 165: "DB", 172: "DB", 179: "DB", 186: "DB", 188: "DB", 213: "DB", 221: "DB", 116: "DB", 132: "DB",

      // Middle of the board
      112: "MB",
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
    this.countPointsYAxis(); // console points on Y for test 
    this.countPointsXAxis(); //console points on x for test 
    this.testPointInRealTime() // Div in DOM for test
    if (this.goodTimeTorenderwords) {
      this.renderWords();
      this.goodTimeTorenderwords = false;
    }
  }

  //function for test of real time points in DOM
  testPointInRealTime() {

    let x = 0;
    if (this.putTilesThisRound.length) {
      let that = this;
      x = that.countPointsXAxis() + that.countPointsYAxis() + that.sevenTiles();
    }
    $(".tpirt").remove();
    let $tpirt = $('<div class="tpirt"><h2>Möjliga poäng</h2></div>').appendTo("body");
    // $tpirt.append(`<h3>+${x}</h3>`)
    if (x > 20)
      $tpirt.append(`<h3>&#128081;+${x}&#128081;</h3>`)
    if (x <= 20 && x >= 10)
      $tpirt.append(`<h3>&#128077 +${x} &#128077;</h3>`)
    if (x < 10)
      $tpirt.append(`<h3>+${x}</h3>`)
  }

  async renderWords() {
    let t = this.uniqueWordsPlayed(this.wordsPlayed);
    $(".wordsOnScreen").remove();
    $(document).ready(function () {
      $(".wordsOnScreen").click(function () {
        $lis.toggle();
      });
    });
    let $wordsOnscreen = $('<div class="wordsOnScreen"></div>').appendTo("body");
    let $wordsTitle = $(' <div class= "wordsTitle" >Spelade Ord</div > ');
    $wordsTitle.appendTo($wordsOnscreen);
    let $box = $('<div class="box"></div>')
    $box.appendTo($wordsOnscreen);
    let $lis = $('<ul class="lis"></ul>');
    $lis.appendTo($box);
    for (let w of t) {
      let html = $('<div>' + await SAOLchecker.lookupWord(w) + '</div>');
      let meaning = html.find('.lexem').text();
      let meaning2 = html.find('.def').text();
      if (meaning) {
        if (meaning.length < 200) {
          //console.log("LEXEM CLASS meaning", meaning)
          $lis.append(`<li data-tooltip="` + meaning + `" data-tooltip-position="right"> ${w}</li>`);
        }
        else {
          //console.log("LEXEM CLASS meaning", meaning.substring(0, 100))
          $lis.append(`<li data-tooltip="` + meaning.substring(0, 100) + `" data-tooltip-position="right"> ${w}</li>`); // words too long. find a way to fiter
        }
      }
      else if (meaning2) {
        if (meaning2.length < 200) {
          // console.log("DEF CLASS  meaning", meaning2)
          $lis.append(`<li data-tooltip="` + meaning2 + `" data-tooltip-position="right"> ${w}</li>`);
        }
        else {
          //console.log("DEF CLASS  meaning", meaning.substring(0, 100))
          $lis.append(`<li data-tooltip="` + meaning2.substring(0, 100) + `" data-tooltip-position="right"> ${w}</li>`); // words too long. find a way to fiter
        }
      }
    }

  }


  // This function checks if tiles of this round are touching each other
  checkXYAxisHM(game) {

    if (this.putTilesThisRound.length > 1) { // Only do the function if there are tiles on the board
      let pttrl = this.putTilesThisRound;
      for (let tile of pttrl) {
        tile.row = Math.floor(tile.boardIndex / 15);
        tile.col = tile.boardIndex % 15;
      }
      let errorCounter = 0;
      for (let i = 0; i < pttrl.length - 1; i++) {
        if ((pttrl[i].row !== pttrl[i + 1].row)) {
          errorCounter++;
          break;
        }
      }
      for (let i = 0; i < pttrl.length - 1; i++) {
        if ((pttrl[i].col !== pttrl[i + 1].col)) {
          errorCounter++;
          break;
        }
      }
      if (errorCounter === 2) {
        //alert(message);
        game.renderMessage(7);
        return false;
      }
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
          if (!this.matrix[yStartIndex][xStartIndex].tile) { game.renderMessage(7); return false; }
          xStartIndex++;
        }
      }
      if (yStartIndex !== yEndIndex) { // Same as before but in columns
        while (yStartIndex <= yEndIndex) {
          if (!this.matrix[yStartIndex][xStartIndex].tile) { game.renderMessage(7); return false; }
          yStartIndex++;
        }
      }
    }
    return true;
  }



  // this function is checks if tiles are touching tiles from previous rounds
  nextToPutTilesHM(game) {
    if (!this.putTiles.length) {
      return true;
    }
    for (let newTile of this.putTilesThisRound) {
      for (let oldTile of this.putTiles) {
        let newX = Math.floor(newTile.boardIndex / 15);
        let newY = newTile.boardIndex % 15;
        let oldX = Math.floor(oldTile.boardIndex / 15);
        let oldY = oldTile.boardIndex % 15;

        if (Math.abs(oldX - newX) === 1 && oldY === newY) {
          return true;
        }
        if (Math.abs(oldY - newY) === 1 && oldX === newX) {
          return true;
        }
      }
    }
    game.renderMessage(6);
    return false;
  }


  checkMiddleSquare(game) {
    // If the first round is being played
    if (this.firstRound) {
      let temp = 0;
      for (let tile of this.putTilesThisRound) {
        // If one of the newly placed tiles is on the middle square, function returns true
        if (tile.boardIndex === 112) {
          this.firstRound = false;
          game.store.firstRound = false;
          return true;
        } else {
          // Checks if the loop is on the last tile in the putTilesThisRound array
          if (temp === this.putTilesThisRound.length - 1) {
            /*alert(
              "You must place one of your tiles in the middle of the board."
            );*/
            game.renderMessage(4);
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
    return uniqueStrings;
  }

  // For later (maybe) list of uniue words played in the game

  uniqueWordsPlayed(wPlayed) {
    let uniqueStrings = [];
    $.each(wPlayed, (i, el) => {
      if ($.inArray(el, uniqueStrings) === -1)
        uniqueStrings.push(el);
    });
    return uniqueStrings;

  }




  // array of potencial words from methods  findWordsAcrossYaxis() and
  // findWordsAcrossXaxis() 

  async checkIfWord(game, array) {

    let word = ""; // we will put each potencial word of the array here.
    for (let ord of array) {
      if (ord.length > 1) {  // words consisted of 1 letter are not considered
        word = ord;
        this.falseCounter = (await SAOLchecker.scrabbleOk(word)) ? 0 : 1;  // checks the dictionary
        if (this.falseCounter === 1) {
          let w = word.toUpperCase();
          game.renderMessage(5, w);
          //alert("'" + word.toUpperCase() + "' is NOT a correct word from the Swedish dictionary!");
          break;
        }
        this.wordsPlayed.push(word); //add another correct word to the list
      }

    }
  }
  //Function to count points in the Y axis

  countPointsYAxis() {
    if (this.putTilesThisRound.length) {  // if there is a tile on the board.
      let points = 0;                   //variable for points this round.
      let letterPoints = 0;             // variable for the value of the tile
      let wordMultiplyer = 1;       // Multiplier cannot be 0 
      let checkUpDown = 0;          //  counter of tiles on same Y axis

      for (let t of this.putTilesThisRound) {  // for tiles put on this round 
        let yIndex = Math.floor(t.boardIndex / 15);  // change coordinates to (Y,X)
        let xIndex = t.boardIndex % 15;

        try { //this try will catch the error of placing the first tile  on a corner
          if (checkUpDown < 2 && (this.matrix[yIndex + 1][xIndex].tile || this.matrix[yIndex - 1][xIndex].tile)) {  // if there are tiles UP or DOWN

            try {
              while (this.matrix[yIndex][xIndex].tile) { //while theres is a tile on the board
                checkUpDown += this.matrix[yIndex][xIndex].tile.hasBeenPlaced ? 0 : 1; // we count that tile as "checked" , we dont count it again

                letterPoints += this.matrix[yIndex][xIndex].tile.points; // assing value of the tile to variable
                if (this.matrix[yIndex][xIndex].specialS && !this.matrix[yIndex][xIndex].tile.hasBeenPlaced) { //if it is a special square and not placed before

                  //mutiply by the value of special square. Letter are added now. Word multipler will be added later.
                  switch (this.matrix[yIndex][xIndex].specialS) {
                    case 'TO': wordMultiplyer *= 3; break;
                    case 'DO': wordMultiplyer *= 2; break;
                    case 'MB': wordMultiplyer *= 2; break;
                    case 'DB': letterPoints *= 2; break;
                    case 'TB': letterPoints *= 3; break;
                  }
                }
                points += letterPoints; //add the letter points to "points"
                letterPoints = 0; // we reset the variable for next loop - new tile will be assign
                yIndex++;  // we move one square up and check again.
              }
            }
            catch (error) {  //catching the error of counting points over the edge of the board
              yIndex--;

            }
            // now teh same as before but we go down instead.
            yIndex = Math.floor(t.boardIndex / 15) - 1;
            try {
              while (this.matrix[yIndex][xIndex].tile) {
                checkUpDown += this.matrix[yIndex][xIndex].tile.hasBeenPlaced ? 0 : 1;
                letterPoints += this.matrix[yIndex][xIndex].tile.points;
                if (this.matrix[yIndex][xIndex].specialS && !this.matrix[yIndex][xIndex].tile.hasBeenPlaced) {
                  switch (this.matrix[yIndex][xIndex].specialS) {
                    case 'TO': wordMultiplyer *= 3; break;
                    case 'DO': wordMultiplyer *= 2; break;
                    case 'MB': wordMultiplyer *= 2; break;
                    case 'DB': letterPoints *= 2; break;
                    case 'TB': letterPoints *= 3; break;
                  }
                }
                points += letterPoints; // add the letter points 
                letterPoints = 0;   // reset for next loop
                yIndex--; // go down one square
              }
              points *= wordMultiplyer;  // NOW we mulply the word
              wordMultiplyer = 1;  // we reset it to 1 again for next loop
            } catch (error) {
              yIndex++;

            }
          }

        } catch (error) { }  // test
      }
      return points;  // we returned the points counted on Y axis.
    }
  }

  // same as before - countPointsYAxis() -  but now on X axis , mirrored function.

  countPointsXAxis() {
    if (this.putTilesThisRound.length) {
      let points = 0;
      let letterPoints = 0;
      let wordMultiplyer = 1;
      let checkLeftRight = 0;

      for (let t of this.putTilesThisRound) {
        let yIndex = Math.floor(t.boardIndex / 15);
        let xIndex = t.boardIndex % 15;
        try {
          if (checkLeftRight < 2 && (this.matrix[yIndex][xIndex + 1].tile || this.matrix[yIndex][xIndex - 1].tile)) {
            try {
              while (this.matrix[yIndex][xIndex].tile) {
                checkLeftRight += this.matrix[yIndex][xIndex].tile.hasBeenPlaced ? 0 : 1;
                letterPoints += this.matrix[yIndex][xIndex].tile.points;
                if (this.matrix[yIndex][xIndex].specialS && !this.matrix[yIndex][xIndex].tile.hasBeenPlaced) {
                  switch (this.matrix[yIndex][xIndex].specialS) {
                    case 'TO': wordMultiplyer *= 3; break;
                    case 'DO': wordMultiplyer *= 2; break;
                    case 'MB': wordMultiplyer *= 2; break;
                    case 'DB': letterPoints *= 2; break;
                    case 'TB': letterPoints *= 3; break;
                  }
                }
                points += letterPoints;
                letterPoints = 0;
                xIndex++;
              }
            }
            catch (error) {
              xIndex--;
            }
            xIndex = (t.boardIndex % 15) - 1;
            try {

              while (this.matrix[yIndex][xIndex].tile) {
                checkLeftRight += this.matrix[yIndex][xIndex].tile.hasBeenPlaced ? 0 : 1;
                letterPoints += this.matrix[yIndex][xIndex].tile.points;
                if (this.matrix[yIndex][xIndex].specialS && !this.matrix[yIndex][xIndex].tile.hasBeenPlaced) {
                  switch (this.matrix[yIndex][xIndex].specialS) {
                    case 'TO': wordMultiplyer *= 3; break;
                    case 'DO': wordMultiplyer *= 2; break;
                    case 'MB': wordMultiplyer *= 2; break;
                    case 'DB': letterPoints *= 2; break;
                    case 'TB': letterPoints *= 3; break;
                  }
                }
                points += letterPoints;
                letterPoints = 0;
                xIndex--;
              }

              points *= wordMultiplyer;
              wordMultiplyer = 1;
            } catch (error) {
              xIndex++;

            }
          }
        }
        catch (error) { }
      }
      return points;  // we return  the points counted on X axis
    }
  }

  sevenTiles() {

    let points = 0;

    return this.putTilesThisRound.length === 7 ? points = 50 : points = 0;

  }



}



