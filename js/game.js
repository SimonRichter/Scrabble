import Player from "./Player.js";
import Board from "./Board.js";
import Tile from "./Tile.js";
import Bag from "./Bag.js";
import SAOLchecker from "./SAOLchecker.js";

export default class Game {
  async start() {
    this.board = new Board();
    this.board.createBoard();
    this.playerTurn = 0;
    this.skipCounter = 0;

    await this.tilesFromFile();
    // create players
    this.players = [new Player(this, "Player 1"), new Player(this, "Player 2")];
    // render the menu + board + players
    this.renderMenu();
    this.board.render();
    this.renderStand();
    this.addClickEvents();
  }

  async tilesFromFile() {
    this.bag = new Bag();
    // Read the tile info from file
    (await $.get("data/tiles.txt"))
      .split("\r")
      .join("") // Windows safe :)
      .split("\n")
      .forEach((x) => {
        // For each line split content by ' '
        // x[0] = char, x[1] = points, x[2] = occurences
        x = x.split(" ");
        x[0] = x[0] === "_" ? " " : x[0];
        // add tiles to this.tiles
        while (x[2]--) {
          this.bag.tiles.push(new Tile(x[0], +x[1]));
        }
      });
    // Shuffle in random order
    this.bag.tiles.sort(() => Math.random() - 0.5);
  }

  getTiles(howMany = 7) {
    // Return a number of tiles (and remove from this.tiles)
    return this.bag.tiles.splice(0, howMany);
  }

  renderMenu() {
    //create menu div
    let div = document.createElement("div");
    div.className = "menu";
    document.body.appendChild(div);

    //create buttons
    let menu = document.getElementsByClassName("menu")[0];

    let spela = document.createElement("button");
    spela.setAttribute("class", "btn skip");
    spela.setAttribute("id", "submitButton");
    spela.textContent = "Spela";
    menu.appendChild(spela);

    let passa = document.createElement("button");
    passa.setAttribute("class", "btn skip");
    passa.setAttribute("id", "skipButton");
    passa.textContent = "Passa";
    menu.appendChild(passa);

    let byt = document.createElement("button");
    byt.setAttribute("class", "btn skip");
    byt.textContent = "Byt";
    menu.appendChild(byt);
  }

  renderStand() {
    // Create the players divs
    $(".players").remove();
    let $players = $('<div class="players"/>').appendTo("body");

    // Render the players
    $players.append(this.players[this.playerTurn].render());
    this.addDragEvents();
  }

  // Funtion for SAOL
  async checkWordSaol(wordToCheck) {
    await SAOLchecker.scrabbleOk(wordToCheck); // if will Be true or false after checking the dictionary
  }

  addClickEvents() {
    let that = this;
    $("#submitButton").click(function () {

      if (that.board.falseCounter === 0) {
        //if(checkWordSaol() &&  ********* conditions if word true and other condtions will be here
        // point 6 and 7 from Trello)
        for (let i = 0; i < that.board.putTilesThisRound.length; i++) {
          that.players[that.playerTurn].tiles.push(that.bag.tiles.pop());
        }
        while (that.board.putTilesThisRound.length) {
          let squareIndex = that.board.putTilesThisRound[0].boardIndex;
          console.log("squareIndex", squareIndex);
          let y = Math.floor(squareIndex / 15);
          let x = squareIndex % 15;
          that.board.matrix[y][x].tile.hasBeenPlaced = true;
          that.board.putTiles.push(that.board.putTilesThisRound.shift());
        }
        that.playerTurn === 0 ? (that.playerTurn = 1) : (that.playerTurn = 0);
        that.renderStand();
        console.log("How long is the bag lol:", that.bag.tiles.length);
        that.board.render();
        console.log("putTiles", that.board.putTiles);
      }
    });


    $("#skipButton").click(function () {


      that.players[that.playerTurn].skipCounter++;

      that.playerTurn++;
      that.playerTurn === 0 ? (that.playerTurn = 1) : (that.playerTurn = 0);
      that.renderStand();
    });

    /* $("#skipButton").click(function () {
  
      that.players[that.playerTurn].skipCounter++;
  
      that.playerTurn++;
      that.playerTurn === 0 ? (that.playerTurn = 1) : (that.playerTurn = 0);
      that.renderStand();
  
    });*/


  }

  addDragEvents() {
    $(".stand .tile").hover(
      function () {
        $(this).css("opacity", "0.9");
      },
      function () {
        $(this).css("opacity", "");
      }
    );

    // Set a css-class hover on the square the mouse is above
    // if we are dragging and there is no tile in the square
    $(".board > div").mouseenter((e) => {
      let me = $(e.currentTarget);
      if ($(".is-dragging").length && !me.find(".tile").length) {
        me.addClass("hover");
      }
    });
    $(".board > div").mouseleave((e) =>
      $(e.currentTarget).removeClass("hover")
    );

    // Drag-events: We only check if a tile is in place on dragEnd
    $(".stand .tile")
      .not(".none")
      .draggabilly()
      .on("dragEnd", (e) => {
        // get the dropZone square - if none render and return
        let $dropZone = $(".hover");
        if (!$dropZone.length) {
          this.renderStand();
          return;
        }

        // the index of the square we are hovering over
        let squareIndex = $(".board > div").index($dropZone);

        // convert to y and x coords in this.board
        let y = Math.floor(squareIndex / 15);
        let x = squareIndex % 15;

        // the index of the chosen tile
        let $tile = $(e.currentTarget);
        let tileIndex = $(".stand > div").index($tile);

        // put the tile on the board and re-render
        this.board.matrix[y][x].tile = this.players[
          this.playerTurn
        ].tiles.splice(tileIndex, 1)[0];
        console.log("what is this??", squareIndex);

        this.board.matrix[y][x].tile.boardIndex = squareIndex;
        this.board.putTilesThisRound.push(this.board.matrix[y][x].tile);
        this.board.render();
        this.renderStand();
      });

    let yStart = 0;
    let xStart = 0;

    $(".tilePlacedThisRound")
      .draggabilly()
      .on("dragStart", (e) => {
        let $tile = $(e.currentTarget);
        let tileIndex = $(".board > div").index($tile.parent());
        $tile.addClass("dragging");
        // convert to y and x coords in this.board
        yStart = Math.floor(tileIndex / 15);
        xStart = tileIndex % 15;
        $(".stand").mouseenter((e) => {
          $(e.currentTarget).addClass("hover");
        });
        $(".stand").mouseleave((e) => $(e.currentTarget).removeClass("hover"));
      })
      .on("dragEnd", (e) => {
        // get the dropZone square - if none render and return
        let $dropZone = $(".hover");
        if (!$dropZone.length) {
          this.board.render();
          this.renderStand();
          this.addDragEvents();
          return;
        }

        if ($(".stand").hasClass("hover")) {
          this.board.matrix[yStart][xStart].tile.hasBeenPlaced = false;
          this.players[this.playerTurn].tiles.push(
            this.board.matrix[yStart][xStart].tile
          );
          let indexOf = this.board.putTilesThisRound.indexOf(
            this.board.matrix[yStart][xStart].tile
          );
          this.board.putTilesThisRound.splice(
            indexOf, 1
          );
          delete this.board.matrix[yStart][xStart].tile;
        } else {
          // the index of the square we are hovering over
          let squareIndex = $(".board > div").index($dropZone);

          // convert to y and x coords in this.board
          let y = Math.floor(squareIndex / 15);
          let x = squareIndex % 15;

          // put the tile on the board and re-render
          this.board.matrix[y][x].tile = this.board.matrix[yStart][xStart].tile;

          this.board.matrix[y][x].tile.boardIndex = squareIndex;
          delete this.board.matrix[yStart][xStart].tile;
          // this.board.matrix[yStart][xStart][].pop(this.board.matrix[yStart][xStart]);
        }
        let $tile = $(e.currentTarget);
        $tile.removeClass("dragging").removeClass("hover");
        this.board.render();
        this.renderStand();
      });
  }
}
