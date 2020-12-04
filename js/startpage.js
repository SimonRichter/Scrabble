export default class StartPage {

  constructor() {
    this.render();
  }

  render() {
    $('body').append(`<header class="startpage">
    <div class="btn-container">
    <button class="newgame">NYTT SPEL</button>
    <button class="joingame">GÅ MED I BEFINTLIGT SPEL</button>
    </div>
    </header>`);

    /* $('body').css({
       'background-color': '#0e2b3c',
       'background-image': 'url(scrabble_startpage.png)',
       'background-repeat': 'no-repeat',
       'background-position': 'center',
       'background-size': '1020px',
       'background-attachment': 'fixed'
     });*/

  }


}