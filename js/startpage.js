export default class StartPage {

  constructor() {
    this.render();
    this.addClickEvents();
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
      console.log('Starting new game...');
      $('.startpage').html('<input type="text" name="playerName" placeholder="Namn:" class="entername"></input>');
      console.log(getName());
    })

    $('.joingame').click(() => {
      console.log('Joining game...');
      $('.startpage').html('<input type="text" name="playerName" placeholder="Kod:" class="enterkey"></input>');
    })

    const getName = () => {
      this.playerName = $('input[name="playerName"]').val();
      return this.playerName;
    };
  }


}