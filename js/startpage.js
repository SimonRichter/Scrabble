export default class StartPage {

  constructor() {
    this.render();
  }

  render() {
    $('body').append(`<header class="startpage">
    <h1>SCRABBLE</h1>
    <button class="newgame">NYTT SPEL</button>
    <button class="joingame">GÅ MED I BEFINTLIGT SPEL</button>
    </header>`);

    $('body').css({
      'background-color': '#0e2b3c',
      'background-image': 'url(gridvector.svg)',
      'background-repeat': 'no-repeat',
      'background-position': '45%',
      'background-attachment': 'fixed',
      'background-size': 'auto'
    });


  }


}