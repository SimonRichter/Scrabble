import Player from "./Player.js";
import Board from "./Board.js";
import Tile from "./Tile.js";
import Bag from "./Bag.js";
import Store from 'https://network-lite.nodehill.com/store';
import StartPage from './startpage.js';



export default class Game {

  constructor() {
    this.startPage = new StartPage();
    this.addEventListeners();
  }

  async startWithStoreParameters() {
    this.localStore = Store.getLocalStore();
    this.localStore.leaderBoard = this.localStore.leaderBoard || [];
    this.board = new Board();
    this.store.board = this.store.board || {};
    this.board.matrix = await this.store.board.matrix;
    this.bag = new Bag();
    this.bag.tiles = await this.store.bag.tiles;
    this.playerTurn = await this.store.playerTurn;
    this.player = new Player(this, this.store, this.playerName); //Are the players added correctly?
    this.store.scores = await this.store.scores || [];
    await this.store.scores.push(this.player.score);
    this.store.minusPoints = this.store.minusPoints || [];
    this.gameOverCounter = 0;
    this.waitForInfoToBeLoaded = false;
    this.listenForNetworkChanges();
  }

  async start() {
    this.store.waitForStoreDataToBeSaved = true;
    this.localStore = Store.getLocalStore();
    this.localStore.leaderBoard = this.localStore.leaderBoard || [];

    this.board = new Board();
    this.board.createBoard();

    await this.tilesFromFile();
    //await this.connectToStore();
    this.store.bag = this.bag;
    this.store.bag.tiles = this.bag.tiles;
    // create players
    this.player = new Player(this, this.store, this.playerName);


    // Push all the info to the store

    // s.playerNames = await s.playerNames || [];
    // // Add my name
    // await s.playerNames.push(this.playerName);
    // // Which player am I? (0 or 1)
    // this.playerIndex = s.playerNames.length - 1;
    // this.playerTurn = this.playerIndex;
    this.store.scores = await this.store.scores || [];
    await this.store.scores.push(this.player.score);
    this.store.board = this.store.board || {};
    this.store.board.matrix = this.board.matrix;
    this.store.board.putTiles = this.board.putTiles;
    this.store.board.putTilesThisRound = this.board.putTilesThisRound;
    this.store.board.wordsPlayed = this.board.wordsPlayed;
    this.store.firstRound = this.board.firstRound;
    this.store.board.matrix = this.board.matrix;
    this.store.skipCounter = 0;
    this.store.gameOver = false;
    this.store.minusPoints = this.store.minusPoints || [];
    this.gameOverCounter = 0;
    this.waitForInfoToBeLoaded = false;
    this.store.waitForStoreDataToBeSaved = false;
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
        x = x.split(" ");
        x[0] = x[0] === "_" ? " " : x[0];
        // add tiles to this.bag.tiles
        while (x[2]--) {
          this.bag.tiles.push(new Tile(x[0], +x[1]));
        }
      });

    // Better random/shuffle of the bag. 
    let s, i; // s="storage" i="index"
    for (let t = this.bag.tiles.length - 1; t > 0; t--) { //we start the shuffle from the last t(tile) position of the array and until 0. 
      i = Math.floor(Math.random() * t); // i(index) will be a random between (1) and (tiles-available).
      s = this.bag.tiles[t]; // we put the current last tile position in a temporary storage.
      this.bag.tiles[t] = this.bag.tiles[i]; // current last tile postion will have the random position from i(index)
      this.bag.tiles[i] = s; //  now we take the tile from the temporary storage 's' and put it the random index.
    }
  }

  renderMenu() {
    // Create menu div
    $('.menu').remove();
    let div = document.createElement("div");
    div.className = "menu";
    document.body.appendChild(div);

    // Create buttons and append to menu div
    let menu = document.getElementsByClassName("menu")[0];

    let ångra = document.createElement("button");
    ångra.setAttribute("class", "btn skip");
    ångra.setAttribute("id", "clearButton");
    ångra.textContent = "Ångra";
    menu.appendChild(ångra);

    // Passa button
    let passa = document.createElement("button");
    passa.setAttribute("class", "btn skip");
    passa.setAttribute("id", "skipButton");
    passa.textContent = "Passa";
    menu.appendChild(passa);
    // Spela button
    let spela = document.createElement("button");
    spela.setAttribute("class", "btn skip");
    spela.setAttribute("id", "submitButton");
    spela.textContent = "Spela";
    menu.appendChild(spela);

    // Byt button 
    let byt = document.createElement("button");
    byt.setAttribute("class", "btn skip");
    byt.setAttribute("id", "changeTilesButton")
    byt.textContent = "Byt";
    menu.appendChild(byt);

  }

  renderStand() {
    // Create the players div
    $(".players").remove();
    let $players = $('<div class="players"/>').appendTo("body");

    // Render the players
    $players.append(this.renderPlayer());
    // Add drag events
    this.addDragEvents();
  }

  renderTilesLeft() {
    // Remove old div
    $(".tilesLeft").remove();
    // Create a new div 
    let div = document.createElement("div");
    div.className = "tilesLeft";
    document.body.appendChild(div);
    let t = document.getElementsByClassName("tilesLeft")[0];
    // Create <p> element and append to div
    let p = document.createElement("p");
    let text = document.createTextNode(this.bag.tiles.length + "  brickor kvar");
    p.appendChild(text);
    t.appendChild(p);
  }




  addClickEvents() {
    let that = this;
    $("body").on("click", "#submitButton", (e) => {
      that.board.falseCounter = 1;    // falseCounter resets to 1 (false) at the begging of the round

      if (that.board.putTilesThisRound.length) { //if there are tiles on the board

        //we put both arrays together into one variable
        let allWords = that.board.findWordsAcrossXaxis().concat(that.board.findWordsAcrossYaxis());

        that.board.checkIfWord(that, allWords).then(x => {     //it will wait for Promised to be fullfilled before running the next code.

          //check  all functions must be True to be able to go next player after pressing "spela"
          if (that.board.checkMiddleSquare(that) && that.board.checkXYAxisHM(that) && that.board.nextToPutTilesHM(that) && that.board.falseCounter === 0) {
            //that.board.uniqueWordsPlayed(that.board.wordsPlayed); // Updates the list of unique words played in the game.
            that.store.skipCounter = 0; //Skip RESETS when a correct word is written.
            $('.menu').addClass('gray');

            // we add the points counted and add them to the Players Score.
            that.store.scores[that.playerTurn] += that.board.countPointsXAxis() + that.board.countPointsYAxis() + that.board.sevenTiles();


            // Fill the player stand with tiles again after they submit a correct word
            for (let i = 0; i < that.board.putTilesThisRound.length; i++) {
              if (that.bag.tiles.length > 0) {
                that.player.stand.push(that.bag.tiles.pop());
              }
            }
            // This while loop assigns a boardIndex to the placed tile objects
            // in the board matrix and makes sure that the tiles can't be moved
            // in the next round
            while (that.board.putTilesThisRound.length) {
              let squareIndex = that.board.putTilesThisRound[0].boardIndex;
              let y = Math.floor(squareIndex / 15);
              let x = squareIndex % 15;
              that.board.matrix[y][x].tile.hasBeenPlaced = true;
              // We also push the tiles from putTilesThisRound to putTiles
              that.board.putTiles.push(that.board.putTilesThisRound.shift());
            }
            that.board.goodTimeTorenderwords = true;
            that.renderScoreBoard();

            that.board.render();
            // We change the player turn to the next player
            that.playerTurn === (that.store.playerNames.length - 1) ? (that.playerTurn = 0) : (that.playerTurn++);

            that.renderStand();
            that.store.playerTurn = that.playerTurn;
            that.renderDisableEventListeners();
            //that.disableButtons();
            // We then re-render the stand and board
            //that.board.render();
            that.store.board.matrix = that.board.matrix;
            that.store.board.putTiles = that.board.putTiles;
            that.store.board.putTilesThisRound = that.board.putTilesThisRound;
            that.store.board.wordsPlayed = that.board.wordsPlayed;
            that.store.bag.tiles = that.bag.tiles;
            that.renderTilesLeft();
            if (that.bag.tiles.length === 0 && that.player.stand.length === 0) {
              that.store.gameOver = true;

            }
          }
        });
      }
      else
        that.renderMessage(1);

    });

    $("body").on("click", "#skipButton", (e) => {
      if (that.board.putTilesThisRound.length) {

        for (let i = that.board.putTilesThisRound.length - 1; i >= 0; i--) {

          let squareIndex = that.board.putTilesThisRound[i].boardIndex;
          let y = Math.floor(squareIndex / 15);
          let x = squareIndex % 15;
          delete that.board.matrix[y][x].tile;
          that.changeBackEmptyTile(that.board.putTilesThisRound[i]);
          that.player.stand.push(that.board.putTilesThisRound[i]);
          that.board.putTilesThisRound.splice(i, 1);
        }
        that.store.board.putTilesThisRound = that.board.putTilesThisRound;
      }
      $('.menu').addClass('gray');
      that.store.skipCounter++;
      if (that.store.skipCounter >= (that.store.amountOfPlayers * 2)) {
        that.store.gameOver = true;
        return;
      }
      that.playerTurn === (that.store.playerNames.length - 1) ? (that.playerTurn = 0) : (that.playerTurn++);
      that.renderStand();
      that.store.playerTurn = that.playerTurn;
      that.board.render();
      that.renderDisableEventListeners();

    });



    // Button to shuffle the tiles in the rack. (test)
    $("body").on("click", "#shuffle", (e) => {
      that.player.stand.sort(() => Math.random() - 0.5);
    });

    // Click event for toggling a border on tiles in the stand
    $("body").on("click", ".stand .tile", (e) => {
      let me = $(e.currentTarget);
      me.toggleClass("redBorder");
    });

    // Click event for switching out tiles between the stand and the bag
    $("body").on("click", "#changeTilesButton", function () {
      if ($(".redBorder").length === 0) {
        that.renderMessage(2);
        return;
      }
      // We make sure there are enough tiles in the bag to be switched out
      if (that.bag.tiles.length >= $(".redBorder").length) {
        // If tiles have been put on the board they go back to the players stand
        if (that.board.putTilesThisRound.length > 0) {

          for (let i = that.board.putTilesThisRound.length - 1; i >= 0; i--) {

            let squareIndex = that.board.putTilesThisRound[i].boardIndex;
            let y = Math.floor(squareIndex / 15);
            let x = squareIndex % 15;
            delete that.board.matrix[y][x].tile;
            that.changeBackEmptyTile(that.board.putTilesThisRound[i]);
            that.player.stand.push(that.board.putTilesThisRound[i]);
            that.board.putTilesThisRound.splice(i, 1);

          }
        }

        for (let i = $(".redBorder").length - 1; i >= 0; i--) {
          // select the last tile of tiles with the class "redBorder" and save it
          // in the tileIndex variable
          let tileIndex = $(".stand > div").index($(".redBorder")[i]);
          // Push back the tile to the bag
          that.bag.tiles.push(that.player.stand.splice(tileIndex, 1)[0]);

          // Better random/shuffle of the bag. 
          let s, j; // s="storage" i="index"
          for (let t = that.bag.tiles.length - 1; t > 0; t--) { //we start the shuffle from the last t(tile) position of the array and until 0. 
            j = Math.floor(Math.random() * t); // i(index) will be a random between (1) and (tiles-available).
            s = that.bag.tiles[t]; // we put the current last tile position in a temporary storage.
            that.bag.tiles[t] = that.bag.tiles[j]; // current last tile postion will have the random position from i(index)
            that.bag.tiles[j] = s; //  now we take the tile from the temporary storage 's' and put it the random index.
          }
          that.player.stand.push(that.bag.tiles.pop());
        }
        // We change the player turn to the next player
        $('.menu').addClass('gray');
        that.playerTurn === (that.store.playerNames.length - 1) ? (that.playerTurn = 0) : (that.playerTurn++);
        that.renderStand();
        that.store.playerTurn = that.playerTurn;
        that.renderDisableEventListeners();
        that.store.bag.tiles = that.bag.tiles;
      } else {
        that.renderMessage(3);
      }
    });

    $("body").on("click", "#clearButton", (e) => {
      if (that.board.putTilesThisRound.length) {

        for (let i = that.board.putTilesThisRound.length - 1; i >= 0; i--) {

          let squareIndex = that.board.putTilesThisRound[i].boardIndex;
          let y = Math.floor(squareIndex / 15);
          let x = squareIndex % 15;
          delete that.board.matrix[y][x].tile;
          that.changeBackEmptyTile(that.board.putTilesThisRound[i]);
          that.player.stand.push(that.board.putTilesThisRound[i]);
          that.board.putTilesThisRound.splice(i, 1);

        }
      }
      that.board.render();
      that.renderStand();
    });

    $("body").on("click", ".board > div > div", (e) => {
      let y;
      let x;
      let $me = $(e.currentTarget);
      let tileIndex = $me.attr('data-index');
      // convert to y and x coordinates
      y = Math.floor(tileIndex / 15);
      x = tileIndex % 15;
      if (that.board.matrix[y][x].tile.points === 0 && !that.board.matrix[y][x].tile.hasBeenPlaced) {
        $('.letterBox').remove();
        that.changeLetterOfEmptyTile();
        $("body").on("click", "#chooseButton", function () {
          if ($(".letterBox input").val()) {
            let letterInBox = $(".letterBox input").val().toUpperCase();
            let acceptedLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ';
            if (letterInBox.length === 1 && acceptedLetters.includes(letterInBox)) {
              that.board.matrix[y][x].tile.char = letterInBox;
              $(".letterBox").remove();
              that.board.render();
              that.renderStand();
            } else {
              $(".letterBox h4").html("<h4 style='color: red;'>Välj endast EN bokstav</h4>");
              $(".letterBox input").val("")
            }
          }
        });
      }
    });
  }

  addDragEvents() {
    // This function adds some opacity to the tiles in the stand
    // When hovering over them.
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
    // Remove the hover class on mouseleave
    $(".board > div").mouseleave((e) =>
      $(e.currentTarget).removeClass("hover")
    );

    // When moving tiles from the stand, run this code:
    $(".stand .tile")
      .not(".none")
      .draggabilly()
      .on("dragEnd", (e, pointer) => {
        let { pageX, pageY } = pointer; // x and y values for the mouse pointer

        // Pixel values describing where the stand is located
        let $stand = $('.stand');
        let { top, left } = $stand.offset();
        let bottom = top + $stand.height();
        let right = left + $stand.width();

        if (pageX > left && pageX < right
          && pageY > top && pageY < bottom) { // If dragged within the limit of the stand
          let indexOfTile = e.currentTarget.getAttribute('data-tile'); //index in the stand
          let pt = this.player.stand; // Tiles inside the stand
          let tile = pt[indexOfTile]; // The tile that is being dragged
          let newIndex = Math.floor(8 * (pageX - left) / $stand.width()); // New index in stand


          // Move tile to the right location in the stand
          pt.splice(indexOfTile, 1, ' ');
          pt.splice(newIndex + (indexOfTile < newIndex ? 1 : 0), 0, tile); // Make it so you can move tiles to the left as well as right
          // Make the render look good
          while (pt.length > 7) { pt.splice(pt[indexOfTile > newIndex ? 'indexOf' : 'lastIndexOf'](' '), 1); }
          this.renderStand();
        }

        // get the dropZone square -
        // if none re-render the stand to put back the dragged tile and return
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

        // put the tile in the board matrix and re-render the board and stand
        this.board.matrix[y][x].tile = this.player.stand.splice(tileIndex, 1)[0];
        this.board.matrix[y][x].tile.boardIndex = squareIndex;
        this.board.putTilesThisRound.push(this.board.matrix[y][x].tile);
        //this.board.render();
        //this.renderStand();
        let that = this;
        if (this.board.matrix[y][x].tile.char === ' ') {
          $('.letterBox').remove();
          this.changeLetterOfEmptyTile();
          $("#chooseButton").click(function () {
            if ($(".letterBox input").val()) {
              let letterInBox = $(".letterBox input").val().toUpperCase();
              let acceptedLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ';
              if (letterInBox.length === 1 && acceptedLetters.includes(letterInBox)) {
                that.board.matrix[y][x].tile.char = letterInBox;
                that.board.matrix[y][x].tile.points = 0;
                $(".letterBox").remove();
                that.board.render();
                that.renderStand();
              } else {
                $(".letterBox h4").html("<h4 style='color: red;'>Välj endast EN bokstav</h4>");
                $(".letterBox input").val("");
              }
            }
          });
        }
        this.board.render();
        this.renderStand();
      });

    // These variables are declared here so that they can be used
    // both in the following dragStart and dragEnd
    let yStart = 0;
    let xStart = 0;

    // When moving tiles from the board, run this code:
    $(".tilePlacedThisRound")
      .draggabilly()
      .on("dragStart", (e) => {
        // $tile is declared as the tile we are dragging from the board
        let $tile = $(e.currentTarget);

        // we declare tileIndex as the index on the board of the tile being draggec
        let tileIndex = $(".board > div").index($tile.parent());

        // For some reason the is-dragging class is not added to the tile being dragged
        // Therefore we add the class "dragging" which does the same thing as is-dragging
        $tile.addClass("dragging");

        // we save the y and x coordinates of the tile being dragged
        // which will be used in dragEnd later
        yStart = Math.floor(tileIndex / 15);
        xStart = tileIndex % 15;

        // We add some opacity on the tiles in the stand as we are hovering over them
        $(".stand").mouseenter((e) => {
          $(e.currentTarget).addClass("hover");
        });
        // Remove hover class on mouseleave
        $(".stand").mouseleave((e) => $(e.currentTarget).removeClass("hover"));
      })

      .on("dragEnd", (e) => {
        // declare $dropZone to be the square on the DOM board that
        // the mouse is hovering over -
        // if there is no dropZone square (= tile dragged outside the board and stand) re-render and return
        let $dropZone = $(".hover");
        if (!$dropZone.length) {
          this.board.render();
          this.renderStand();
          return;
        }

        // Check if we are dragging the tile above the stand
        if ($(".stand").hasClass("hover")) {
          // Put back the tile
          this.board.matrix[yStart][xStart].tile.hasBeenPlaced = false;
          this.changeBackEmptyTile(this.board.matrix[yStart][xStart].tile);
          this.player.stand.push(
            this.board.matrix[yStart][xStart].tile
          );
          let indexOf = this.board.putTilesThisRound.indexOf(
            this.board.matrix[yStart][xStart].tile
          );
          // Remove the tile from putTilesThisRound and the board matrix
          this.board.putTilesThisRound.splice(indexOf, 1);
          delete this.board.matrix[yStart][xStart].tile;

          // Remove the letterbox div
          $(".letterBox").remove();

          // inside this else we have code that runs if the tile is dragged
          // from one place on the board to another place on the board
        } else {
          // the index of the square we are hovering over
          let squareIndex = $(".board > div").index($dropZone);

          // convert to y and x coordinates
          let y = Math.floor(squareIndex / 15);
          let x = squareIndex % 15;

          // put the tile on the new location in the board matrix
          this.board.matrix[y][x].tile = this.board.matrix[yStart][xStart].tile;
          // Assign the new boardIndex to the tile
          this.board.matrix[y][x].tile.boardIndex = squareIndex;
          // delete the moved tile from the old location
          delete this.board.matrix[yStart][xStart].tile;
        }
        // Remove dragging and hover class and re-render board and stand
        let $tile = $(e.currentTarget);
        $tile.removeClass("dragging").removeClass("hover");
        this.board.render();
        this.renderStand();
      });
  }

  changeBackEmptyTile(tile) {
    if (tile.points === 0) {
      tile.char = ' ';
      tile.points = '';
    }
  }

  changeLetterOfEmptyTile() {
    let div = document.createElement("div");
    div.className = "letterBox";

    let h4 = document.createElement("h4");
    h4.textContent = "Välj en bokstav";
    div.appendChild(h4);

    let input = document.createElement("input");
    div.appendChild(input);

    let choose = document.createElement("button");
    choose.setAttribute("class", "btn skip");
    choose.setAttribute("id", "chooseButton");
    choose.textContent = "Okej";
    div.appendChild(choose);

    document.body.appendChild(div);
  }

  async gameOverPoints() {
    this.gameOverCounter++;


    let points = 0;
    for (let tile of this.player.stand) {
      points += tile.points;
    }
    await this.store.minusPoints.push(points);
    let allPoints = 0;
    for (let point of this.store.minusPoints) {
      allPoints += point;
    }

    this.store.scores[this.playerIndex] += points ? (-1 * points) : allPoints;

    this.renderScoreBoard();
  }

  renderGameOver() {
    // for (let score of this.store.scores) {
    //   this.localStore.leaderBoard.push(score);
    // }
    // console.log("leader lenght?", this.localStore.leaderBoard.length)
    // let topTen = (this.localStore.leaderBoard.sort((a, b) => { return b - a }));
    // console.log(topTen.splice(0, 10))
    // let $leaderBoard = $('<div class="leaderBoard"><h2>Top 10 Scores</h2></div>').appendTo("body");

    // for (let bigPoints of topTen) {
    // $leaderBoard.append(`<h1 class="topTen">${bigPoints}</h1 >`)
    // }
    // Creates the Game Over div that covers whole page
    let $gameover = $('<div class="game-over"/>').appendTo("body");

    // Creates the smaller box with Game Over! text
    $gameover.append(`<div>Game Over!</div>`);
    $(".game-over").fadeIn(1300);
  }

  renderScoreBoard() {
    // Removes any old scoreboard existing
    $(".scoreboard").remove();
    // Creates a new Score Board div
    let $scoreboard = $('<div class="scoreboard"><h2>Poäng</h2></div>').appendTo("body");

    for (let i = 0; i < this.store.playerNames.length; i++) {
      $scoreboard.append(`<div> 
      <h3><span class="numberPlayer">${i + 1}. </span class="playerNames"> ${this.store.playerNames[i]} <span class="scorePlayer">${this.store.scores[i]}</span></h3>
      </div>`)
    }
  }

  renderMessage(m, w) {
    //Remove any old message
    $("div").remove(".message");
    // Create a div to contain message
    let $msg = $('<div class="message"/>').appendTo("body");

    // Select message (argument), append to message div and display it
    if (m === 1) { $msg.append(`<div>&#128683; Inga brickor lagda! &#128683;</div>`); }
    if (m === 2) { $msg.append(`<div>Klicka på de brickor i hållaren du vill byta ut.</div>`); }
    if (m === 3) { $msg.append(`<div>&#128683; Inte tillräckligt med brickor i påsen för att kunna byta. &#128683;</div>`); }
    if (m === 4) { $msg.append(`<div>&#128683; Första rundan måste en bricka spelas i mittenrutan &#128683;</div>`); }
    if (m === 5) { $msg.append(`<div>&#9940 "` + w + `" är inte  ett giltigt  ord  &#9940</div>`); }
    if (m === 6) { $msg.append(`<div>&#128683; Brickor måste hänga samman med tidigare lagda brickor &#128683;</div>`); }
    if (m === 7) { $msg.append(`<div>&#128683; Brickor du lägger måste hänga ihop &#128683;</div>`); }
    $(".message").fadeIn(0);


    //Wait a bit then fade out the message
    setTimeout(function () {
      $(".message").fadeOut(1500);
    }, 3000);

    //And finally delete it
    setTimeout(function () {
      $("div").remove(".message");
    }, 3700);


  }

  renderHelp() {

    $('body').append(`<div class="help"><a href=" https://www.betapet.se/rules/" target="_blank">? <span class="spelregler">Till spelreglerna</span>
</div</div>`);

  }

  addEventListeners() {
    this.amountOfPlayers = 2;
    let that = this;

    $('body').off('click');

    const getName = () => {
      this.playerName = $('.entername').val();
      return this.playerName;
    };

    $("body").on('keyup', '.entername', async function (e) {
      if (e.keyCode === 13) {
        console.log("code running")
        if (!getName()) { return; }
        $("body").off();
        that.playerName = $('.entername').val();
        that.startPage.renderStartPageButtons = false;
        that.key = await Store.createNetworkKey();
        $('.entername').val("Ge den här nyckeln till din vän: " + that.key);
        await that.connectToStore();
        let s = that.store;
        s.amountOfPlayers = that.amountOfPlayers;
        s.playerNames = s.playerNames || [];
        // Add my name
        s.playerNames.push(that.playerName);
        console.log("pushed name, names:", s.playerNames)
        // Which player am I? (0 or 1)
        that.playerIndex = 0;
        s.playerTurn = 0;
        that.playerTurn = 0;
        that.start();
        console.log("amountOfPlayers ", s.amountOfPlayers)
      }
    })

    $('body').on('click', '.playerAmount', () => {
      that.amountOfPlayers += that.amountOfPlayers === 4 ? -2 : 1;
      $('.playerAmount').html('Antal spelare: ' + that.amountOfPlayers);
    })

    $("body").on('keyup', '.startGame', async function (e) {
      if (e.keyCode === 13) {
        that.playerName = that.startPage.playerName;
        if ($('.startGame').val().length === 6) {
          that.startPage.renderStartPageButtons = false;
          that.key = $('.startGame').val().toUpperCase();
          $("body").off();
          await that.connectToStore();
          let s = that.store;
          that.waitForInfoToBeLoaded = true;
          s.playerNames = s.playerNames || [];
          // Add my name
          s.playerNames.push(that.playerName);
          console.log("pushed name, names:", s.playerNames)
          // Which player am I? (0 or 1)
          that.playerIndex = s.playerNames.length - 1;
          that.startWithStoreParameters();
        }
      }
    });

  }

  listenForNetworkChanges() {
    console.log("listenForNetworkChanges() running");
    if (this.store.playerNames.length === this.store.amountOfPlayers && this.waitForInfoToBeLoaded === false
      && this.store.waitForStoreDataToBeSaved === false) {
      console.log("Four players have joined")
      // this method is called each time someone else
      // changes this.store
        $('.startpage').remove();
        $('.playerAmount').remove();
        this.board.matrix = this.store.board.matrix;
        this.board.putTiles = this.store.board.putTiles;
        this.board.putTilesThisRound = this.store.board.putTilesThisRound;
        this.board.wordsPlayed = this.store.board.wordsPlayed;
        this.board.firstRound = this.store.firstRound;
        this.bag.tiles = this.store.bag.tiles;
        this.scores = this.store.scores; // -- save the score everytime "Spela" is pressed. (TODO)
        this.playerTurn = this.store.playerTurn;
        $('body').css({
          'background-image': 'none',
          'background-color': 'none',
          'background-image': 'linear-gradient(0deg, rgba(0,8,19,1) 0%, rgb(39, 148, 211) 100%)',
          'background-size': '100vw 100vh',
        });
        this.board.render();
        this.renderMenu();
        this.renderStand();
        this.renderTilesLeft();
        this.renderScoreBoard();
        this.renderHelp();
        if (this.playerTurn === this.playerIndex) {
          $('.menu').removeClass('gray');
          $('.disabler').remove();
          $('body').off();
          this.addClickEvents();
          console.log("PutTilesThisROund: ", this.board.putTilesThisRound);
          console.log("PutTiles: ", this.board.putTiles);
        }
        if (this.playerTurn != this.playerIndex) {
          this.renderDisableEventListeners();
          $('.menu').addClass('gray');
        }
      if (this.store.gameOver === true && this.gameOverCounter === 0) {
        this.gameOverPoints();
        this.renderGameOver();
      }
    }
  }

  async connectToStore() {
    this.store = await Store.getNetworkStore(
      this.key,
      () => this.listenForNetworkChanges()
    );
  }

  getTiles(howMany = 7) {
    // Return a number of tiles (and remove from this.bag.tiles)
    return this.store.bag.tiles.splice(0, howMany);
  }

  renderPlayer() {
    return `<div class="stand">
      ${this.player.stand
        .map(
          (x, i) => `<div 
          class="tile ${x.char ? "" : "none"}"
          data-player="${this.store.playerNames.indexOf(this.player.name)}"
          data-tile="${i}"
        >
        ${x.char || ""}
        <span>${x.points || ""}</span>
      </div>`
        )
        .join("")}
      </div>
      <div class="pname">${this.playerTurn != this.playerIndex ? "Var snäll och vänta på din tur... &#8987;" : "Din tur att spela !"}</div>
      `;
  }

  renderDisableEventListeners() {
    $('<div class="disabler"/>').appendTo("body");
  }

}


