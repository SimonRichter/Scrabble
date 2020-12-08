export default class StartPage {

  constructor() {
    this.render();
    this.playerName = "";
    this.playerCode = 0;
    this.enteredName = false;
  }

  render() {
    if ($('.startpage').length) {
      $('.startpage').remove();
    }
    $('body').append(`<header class="startpage">
    <div class="btn-container">
    <button class="newgame">NYTT SPEL</button>
    <button class="joingame">GÅ MED I BEFINTLIGT SPEL</button>
    </div>
    </header>`);

    $('body').css({
      'background-color': '#0e2b3c',
      'background-image': 'url(scrabble_startpage.png)',
      'background-repeat': 'no-repeat',
      'background-position': 'center',
      'background-size': '1020px',
      'background-attachment': 'fixed'
    });

    this.addClickEvents();
  }

  addClickEvents() {
    let that = this;
    let keyCodeCheckLoop = false;

    $('.newgame').click(() => {

      $('.btn-container').html('<input type="text" placeholder="Namn:" maxlength="15" class="entername"></input>');
      // When user types name and presses enter(13), players name gets stored in playerName
      $(".entername").keyup(function (e) {
        if (e.keyCode === 13) {
          that.playerName = $(this).val();
          // ENTER FUNCTION THAT STARTS GAME HERE (maybe game constructor can take in player name as argument)
        }
      });

    })

    $('.joingame').click(() => {
      keyCodeCheckLoop = true;
      $('.btn-container').html('<input type="text" placeholder="Namn:" maxlength="15" class="enterkey"></input>');
      // When user types name and presses enter (13), players name gets stored in playerName
      $('.enterkey').keyup(function (e) {
        if (e.keyCode === 13) {
          that.playerName = $(this).val();
          $('.btn-container').html('<input type="text" placeholder="Kod: UTP548" maxlength="6" class="enterkey"></input>');
          // ...then, player types in code which gets stored in playerCode
          $('.enterkey').keyup(function (e) {
            if (e.keyCode === 13) {
              that.playerCode = $(this).val().toUpperCase();
              return;
              // ENTER FUNCTION THAT STARTS GAME WITH CODE HERE
            }
          });

        }
      });

    })


    this.unclickingButton();
  }

  // Function that lets you "click off" the buttons and return to original startpage options
  unclickingButton() {
    let that = this;

    $(document).mouseup(function (e) {
      let container = $(".btn-container");
      // if clicking outside button container, re-renders startpage as is was
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        that.render();
      }
    });

  }

}


