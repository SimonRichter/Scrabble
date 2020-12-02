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

    $('body').css('background-color', '#0e2b3c');
    $('body').css('background-image', 'url(gridvector.svg)');
    $('body').css('background-repeat', 'no-repeat');
    $('body').css('background-position', '50% 50%'); // how to include space..
    $('body').css('background-attachment', 'fixed');
    $('body').css('background-size', '60%');


  }


}