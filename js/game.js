import Player from "./Player.js";
import Board from "./Board.js";
import Tile from "./Tile.js";
import Bag from "./Bag.js";

export default class Game {
  async start() {
    this.board = new Board();
    this.board.createBoard();
    this.playerTurn = 0;

    await this.tilesFromFile();
    // console.table is a nice way
    // to log arrays and objects
    console.table(this.tiles);
    // create players
    this.players = [new Player(this, "Player 1"), new Player(this, "Player 2")];
    console.table(this.players);
    // render the board + players
    this.board.render();
    this.renderStand();
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

  renderStand() {
    // Create the board and players divs
    $(".players").remove();
    let $players = $('<div class="players"/>').appendTo("body");
    // Render the board
    // (will be more code when we know how to represent
    //  the special squares)
    // Render the players
    $players.append(this.players[this.playerTurn].render());
    this.addDragEvents();
  }

  addDragEvents() {
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
        this.board.board[y][x].tile = this.players[
          this.playerTurn
        ].tiles.splice(tileIndex, 1)[0];
        this.board.render();
        this.renderStand();
      });
  }
}
