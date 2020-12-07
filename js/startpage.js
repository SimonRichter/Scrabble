import Game from "./Game.js";
import Network from "./Network.js";

export default class StartPage {

  constructor() {
    let n = new Network();
    this.render();
    let start = 0;
    setTimeout(() => {
      if (n.store.playerNames.length > 1) { start = 1; }
      console.log('One minute has passed');
      if (start === 1) { $('.startpage').remove(); new Game().start(); }
    }, 30000);
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