export default class StartPage {


  constructor() {
    this.render();
    this.addClickEvents();
    this.playerName = "";
    this.playerCode = 0;
  }

  render() {
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

  }

  addClickEvents() {
    let that = this;
    $('.newgame').click(() => {
      $('.startpage').html('<input type="text" placeholder="Namn:" class="entername"></input>');
      // When user types name and presses enter(13), players name gets stored in playerName
      $(document).on("keypress", "input", function (e) {
        if (e.which == 13) {
          that.playerName = $(this).val();
          // ENTER FUNCTION THAT STARTS GAME HERE (maybe game constructor can take in player name as argument)
        }
      });

    })

    $('.joingame').click(() => {
      console.log('Joining game...');
      $('.startpage').html('<input type="text" placeholder="Namn:" class="enterkey"></input>');
      // When user types name and presses enter (13), players name gets stored in playerName
      $(document).on("keypress", "input", function (e) {
        if (e.which == 13) {
          that.playerName = $(this).val();
          $('.startpage').html('<input type="text" placeholder="Kod:" class="enterkey"></input>');
          // ...then, player types in code which gets stored in playerCode
          $(document).on("keypress", "input", function (e) {
            if (e.which == 13) {
              that.playerCode = $(this).val();
              // ENTER FUNCTION THAT STARTS GAME WITH CODE HERE
            }
          });
        }
      });

    })

  }


}