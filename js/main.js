import Game from './game.js'
import Network from './Network.js';
import StartPage from './startpage.js';
let n = new Network();
new StartPage();
let start = 0;
setTimeout(() => {
  if (n.store.playerNames.length > 1) { start = 1; }
  console.log('One minute has passed');
  if (start === 1) { $('.startpage').remove(); new Game().start(); }
}, 30000);


