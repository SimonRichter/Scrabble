export default class StartPage {

  constructor() {

    this.render();
    this.playerName = "";
    //this.playerCode = 0;
    this.renderStartPageButtons = true;
  }

  render() {
    if ($('.startpage').length) {
      $('.startpage').remove();
    }
    $('body').append(`<div class="startpage">
    <div class="btn-container">
    <button class="newgame">NYTT SPEL</button>
    <button class="joingame">GÅ MED I BEFINTLIGT SPEL</button>
    </div>
    </div>`);

    this.addStartPageClickEvents();
  }

  addStartPageClickEvents() {
    let that = this;
    //let keyCodeCheckLoop = false;

    $('.newgame').click(() => {

      $('.btn-container').html('<input type="text" placeholder="Namn:" minlength="2" maxlength="15" class="entername" id="newGameInputField" spellcheck="false" required></input>');
      // When user types name and presses enter(13), players name gets stored in playerName
      /*$(".entername").keyup(function (e) {
        if (e.keyCode === 13) {
          that.playerName = $(this).val();
          // ENTER FUNCTION THAT STARTS GAME HERE (maybe game constructor can take in player name as argument)
        }
      });*/

    })

    $('.joingame').click(() => {
      //keyCodeCheckLoop = true;
      $('.btn-container').html('<input type="text" placeholder="Namn:" minlength="2" maxlength="15" class="enterkey" spellcheck="false" required></input>');
      // When user types name and presses enter (13), players name gets stored in playerName
      $('.enterkey').keyup(function (e) {
        if (e.keyCode === 13) {
          that.playerName = $(this).val();
          $('.btn-container').html('<input type="text" placeholder="Kodexempel: UTP548" minlength="6" maxlength="6" class="startGame" spellcheck="false" required></input>');
          // ...then, player types in code which gets stored in playerCode
          /*$('.enterkey').keyup(function (e) {
            if (e.keyCode === 13) {
              that.playerCode = $(this).val().toUpperCase();
              return;
              // ENTER FUNCTION THAT STARTS GAME WITH CODE HERE
            }
          });*/

        }
      });

    })


    this.unclickingButton();
  }

  // Function that lets you "click off" the buttons and return to original startpage options
  unclickingButton() {
    let that = this;
    if (this.renderStartPageButtons) {
      $(document).mouseup(function (e) {
        let container = $(".btn-container");
        // if clicking outside button container, re-renders startpage as is was
        if (!container.is(e.target) && container.has(e.target).length === 0) {
          that.render();
        }
      });
    }
  }
}


