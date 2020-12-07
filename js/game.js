import Player from "./Player.js";
import Board from "./Board.js";
import Tile from "./Tile.js";
import Bag from "./Bag.js";
import Store from 'https://network-lite.nodehill.com/store';
import StartPage from './startpage.js';



export default class Game {
  constructor() {
    this.addEventListeners();
    this.renderStart();
    this.StartPage = new StartPage();

  }


  renderStart() {

    $('body').html(/*html*/`
      <div class="start">
        <input type="text" name="playerName" placeholder="Name" required>
      </div>
    `);
  }

  addEventListeners() {

    $('body').off('click');

    $('body').on('click', '.board > div', e =>
      this.makeMove($('.board > div').index(e.currentTarget))
    );

    const getName = () => {
      this.playerName = $('input[name="playerName"]').val();
      return this.playerName;
    };

    $('body').on('click', '.newgame', async () => {
      if (!getName()) { return; }
      this.networkKey = await Store.createNetworkKey();
      $('.start').append('<p style="title">get key ' + this.networkKey + '</p>');
      $('.start-btn').prop('disabled', true);
      this.connectToStore();
    });

    $('body').on('click', '.joingame', () => {
      if (!getName()) { return; }
      this.networkKey = prompt('Enter the network key from your friend:');
      this.connectToStore();
    });

  }
  async connectToStore() {
    this.store = await Store.getNetworkStore(
      this.networkKey,
      () => this.listenForNetworkChanges()
    );

    window.store = this.store; // debug

    // Setup some properties in the store if they do not
    // exist already

    let s = this.store;
    s.playerNames = s.playerNames || [];
    s.currentPlayer = 0;

    // Check that there are not two players already
    if (s.playerNames.length > 1) {
      alert('Someone else is already playing!');
      return;
    }

    // Which player am I? (0 or 1)
    this.playerIndex = s.playerNames.length;

    // Add my name
    s.playerNames.push(this.playerName);

    // Now call render to start the main game
    // if you are player 2
    if (s.playerNames.length > 1) {
      $('.startpage').remove()
      this.start();
      this.tilesFromFile();

    }
  }
  listenForNetworkChanges() {

    // this method is called each time someone else

    // changes this.store

    this.board.render();

  }


  async start() {
    let s = this.store;

    this.board = new Board();
    this.board.createBoard();
    this.playerTurn = 0;
    this.skipCounter = 0;
    this.localStore = Store.getLocalStore();
    this.localStore.leaderBoard = this.localStore.leaderBoard || [];


    await this.tilesFromFile();
    // create players
    this.players = [];
    for (let player of s.playerNames) {
      this.players.push(new Player(this, player));

    }
    // render the menu + board + players
    console.log(this.players);
    s.board.render();
    this.renderMenu();
    this.renderStand();
    this.renderTilesLeft();
    // add click event listener.
    // Since the menu isn't re-rendered we only need to add the click event listener once.
    this.addClickEvents();
    this.renderScoreBoard();
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


  getTiles(howMany = 7) {
    // Return a number of tiles (and remove from this.bag.tiles)
    return this.bag.tiles.splice(0, howMany);
  }

  renderMenu() {
    // Create menu div
    let div = document.createElement("div");
    div.className = "menu";
    document.body.appendChild(div);
    //document.getElementsByClassName("board").appendChild(div);


    // Create buttons and append to menu div
    let menu = document.getElementsByClassName("menu")[0];
    // Spela button
    let spela = document.createElement("button");
    spela.setAttribute("class", "btn skip");
    spela.setAttribute("id", "submitButton");
    spela.textContent = "Spela";
    menu.appendChild(spela);
    // Passa button
    let passa = document.createElement("button");
    passa.setAttribute("class", "btn skip");
    passa.setAttribute("id", "skipButton");
    passa.textContent = "Passa";
    menu.appendChild(passa);

    // Byt button 
    let byt = document.createElement("button");
    byt.setAttribute("class", "btn skip");
    byt.setAttribute("id", "changeTilesButton")
    byt.textContent = "Byt";
    menu.appendChild(byt);

    /*
    let mix = document.createElement("button");
    mix.setAttribute("class", "btn skip");
    mix.setAttribute("id", "shuffle");
    mix.textContent = "Shuffle";
    menu.appendChild(mix);
    */
  }

  renderStand() {
    // Create the players div
    $(".players").remove();
    let $players = $('<div class="players"/>').appendTo("body");

    // Render the players
    $players.append(this.players[this.playerTurn].render());
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
    let text = document.createTextNode("Brickor kvar: " + this.bag.tiles.length);
    p.appendChild(text);
    t.appendChild(p);
  }




  addClickEvents() {
    let that = this;
    $("#submitButton").click(function () {
      that.board.falseCounter = 1;    // falseCounter resets to 1 (false) at the begging of the round

      if (that.board.putTilesThisRound.length) { //if there are tiles on the board

        //we put both arrays together into one variable
        let allWords = that.board.findWordsAcrossXaxis().concat(that.board.findWordsAcrossYaxis());

        that.board.checkIfWord(allWords).then(x => {     //it will wait for Promised to be fullfilled before running the next code.

          //check  all functions must be True to be able to go next player after pressing "spela"
          if (that.board.checkMiddleSquare() && that.board.checkXYAxisHM() && that.board.nextToPutTilesHM() && that.board.falseCounter === 0) {
            //that.board.uniqueWordsPlayed(that.board.wordsPlayed); // Updates the list of unique words played in the game.
            that.skipCounter = 0; //Skip RESETS when a correct word is written. 

            // we add the points counted and add them to the Players Score.
            that.players[that.playerTurn].score += that.board.countPointsXAxis() + that.board.countPointsYAxis();
            console.log('SCORE ', that.players[that.playerTurn].name, '= ', that.players[that.playerTurn].score, " points"); //shows Score on console (for now)

            // Fill the player stand with tiles again after they submit a correct word
            for (let i = 0; i < that.board.putTilesThisRound.length; i++) {
              if (that.bag.tiles.length > 0) {
                that.players[that.playerTurn].stand.push(that.bag.tiles.pop());
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
            that.renderScoreBoard();

            // We change the player turn to the next player
            that.playerTurn === 0 ? (that.playerTurn = 1) : (that.playerTurn = 0);
            // We then re-render the stand and board
            that.board.render();
            that.renderStand();
            that.renderTilesLeft();
            if (that.bag.tiles.length === 0 && !that.players[0].stand.length &&
              !that.players[1].stand.length && !that.players[2].stand.length && !that.players[3].stand.length) {
              that.renderGameOver();
            }
          }
        });
      }
      else
        //alert("No tiles played. Click on 'Passa' if you give up this round."); // if player clicks on "spela" without placeing tiles
        that.renderMessage(1);

    });

    $("#skipButton").click(function () {
      if (that.board.putTilesThisRound.length) {

        for (let i = that.board.putTilesThisRound.length - 1; i >= 0; i--) {

          let squareIndex = that.board.putTilesThisRound[i].boardIndex;
          let y = Math.floor(squareIndex / 15);
          let x = squareIndex % 15;
          delete that.board.matrix[y][x].tile;
          that.changeBackEmptyTile(that.board.putTilesThisRound[i]);
          that.players[that.playerTurn].stand.push(that.board.putTilesThisRound[i]);

          that.board.putTilesThisRound.splice(i, 1);

        }
      }

      that.skipCounter++; //Global skipCounter +1  when clicked. (4 consecutive times to 'Game Over')

      if (that.skipCounter > 3) {
        that.renderGameOver();
      }

      that.playerTurn === 0 ? (that.playerTurn = 1) : (that.playerTurn = 0);

      that.board.render();
      that.renderStand();
      that.renderTilesLeft();
    });



    // Button to shuffle the tiles in the rack. (test)
    $("#shuffle").click(function () {
      that.players[that.playerTurn].stand.sort(() => Math.random() - 0.5) // this random is ok for short arrays.
      that.renderStand();
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
        ///alert("Du måste choosea brickor i din hållare genom att trycka på dem för att kunna byta ut dem.");
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
            that.changeBackEmptyTile(that.board.matrix[yStart][xStart].tile);
            that.players[that.playerTurn].stand.push(that.board.putTilesThisRound[i]);
            that.board.putTilesThisRound.splice(i, 1);
          }
          that.board.render()
        }

        for (let i = $(".redBorder").length - 1; i >= 0; i--) {
          // select the last tile of tiles with the class "redBorder" and save it
          // in the tileIndex variable
          let tileIndex = $(".stand > div").index($(".redBorder")[i]);
          // Push back the tile to the bag
          that.bag.tiles.push(that.players[that.playerTurn
          ].stand.splice(tileIndex, 1)[0]);

          // Better random/shuffle of the bag. 
          let s, j; // s="storage" i="index"
          for (let t = that.bag.tiles.length - 1; t > 0; t--) { //we start the shuffle from the last t(tile) position of the array and until 0. 
            j = Math.floor(Math.random() * t); // i(index) will be a random between (1) and (tiles-available).
            s = that.bag.tiles[t]; // we put the current last tile position in a temporary storage.
            that.bag.tiles[t] = that.bag.tiles[j]; // current last tile postion will have the random position from i(index)
            that.bag.tiles[j] = s; //  now we take the tile from the temporary storage 's' and put it the random index.
          }
          that.players[that.playerTurn].stand.push(that.bag.tiles.pop());
        }
        // We change the player turn to the next player
        that.playerTurn === 0 ? (that.playerTurn = 1) : (that.playerTurn = 0);
        that.renderStand();
      } else {
        renderMessage(3);
        //alert("Det finns inte tillräckligt med brickor i påsen för att kunna byta.")
      }
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
              $(".letterBox input").val('Välj endast en bokstav')
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
      .on("dragEnd", (e) => {
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
        this.board.matrix[y][x].tile = this.players[
          this.playerTurn
        ].stand.splice(tileIndex, 1)[0];
        this.board.matrix[y][x].tile.boardIndex = squareIndex;
        this.board.putTilesThisRound.push(this.board.matrix[y][x].tile);
        this.board.render();
        this.renderStand();
        let that = this;
        if (this.board.matrix[y][x].tile.char === ' ') {
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
                $(".letterBox input").val('Välj endast en bokstav')
              }
            }
          });
        }

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
          this.players[this.playerTurn].stand.push(
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
    h4.textContent = "välj en bokstav";
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

  renderGameOver() {
    for (let player of this.players) {
      this.localStore.leaderBoard.push(player.score);
    }
    // Creates the Game Over div that covers whole page
    let $gameover = $('<div class="game-over"/>').appendTo("body");
    // Creates the smaller box with Game Over! text
    $gameover.append(`<div>Game Over!</div>`);
    $(".game-over").fadeIn(1300);
    this.localStore.leaderBoard.sort((a, b) => { return b - a })
    console.log(this.localStore.leaderBoard.splice(0, 10));
  }

  renderScoreBoard() {
    // Removes any old scoreboard existing
    $(".scoreboard").remove();
    // Creates a new Score Board div
    let $scoreboard = $('<div class="scoreboard"><h2>Poäng</h2></div>').appendTo("body");

    for (let player of this.players) {
      $scoreboard.append(`<div> 
      <h3>${player.name}</h3>
      <p>${player.score}</p>
      </div>`)
    }

  }
  renderMessage(m, w) {
    //Remove any old message
    $("div").remove(".message");
    // Create a div to contain message
    let $msg = $('<div class="message"/>').appendTo("body");

    // Select message (argument), append to message div and display it
    if (m === 1) { $msg.append(`<div>Inga brickor lagda!</div>`); }
    if (m === 2) { $msg.append(`<div>Klicka på de brickor i hållaren du vill byta ut.</div>`); }
    if (m === 3) { $msg.append(`<div>Inte tillräckligt med brickor i påsen för att kunna byta.</div>`); }
    if (m === 4) { $msg.append(`<div>Första rundan måste en bricka spelas i mittenrutan</div>`); }
    if (m === 5) { $msg.append(`<div>&#9940 "` + w + `" är inte  ett giltigt  ord  &#9940</div>`); }
    if (m === 6) { $msg.append(`<div>Brickor måste hänga samman med tidigare lagda brickor</div>`); }
    if (m === 7) { $msg.append(`<div>Brickor du lägger måste hänga ihop</div>`); }
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

}
