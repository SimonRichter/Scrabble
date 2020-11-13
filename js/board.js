// When a tile is placed on the board,
// the tile object for that tile is copied into this array
// The tile object should contain information on where
// on the board it has been placed, for example with the
// field boardIndex in the tile object
let putTiles = [];
function checkXYAxis() {
  // First we hopefully sort the putTiles array so that the tile with
  // the lowest index number on the board is first and the tile
  // with the highest index number on the board is last
  // This is to make sure the function is "reading" the word
  // correctly no matter what order the player puts down the tiles
  putTiles.sort((a, b) => a.index - b.index);
  // Case if the word is two letters long:
  if (putTiles.length === 2) {
    if (
      putTiles[0].boardIndex === putTiles[1].boardIndex - 15 ||
      putTiles[0].boardIndex === putTiles[1].boardIndex - 1
    ) {
      return true;
    } else {
      alert(
        "You did not put down your tiles next to eachother. Please try again."
      );
      return false;
    }
  }
  // Case if the word is horizontally placed on the board
  // First we check if the second letter is below the first one
  else if (putTiles[0].boardIndex === putTiles[1].boardIndex - 15) {
    for (let i = 0; i < putTiles.length; i++) {
      // We use the code in the next if statement until we reach the last letter
      if (i < putTiles.length - 1) {
        if (putTiles[i].boardIndex === putTiles[i + 1].boardIndex - 15) {
          // It's a match so we move on to the next letter
          continue;
        } else {
          alert(
            "You did not put down your tiles next to eachother. Please try again."
          );
          return false;
        }
        // When we have reached the last letter we do one final check
      } else {
        if (putTiles[i].boardIndex === putTiles[i + 1].boardIndex - 15) {
          return true;
        } else {
          alert(
            "You did not put down your tiles next to eachother. Please try again."
          );
          return false;
        }
      }
    }
  }
  // Case if the word is vertically placed on the board
  // First we check if the second letter is to the right of the first one
  else if (putTiles[0].boardIndex === putTiles[1].boardIndex - 1) {
    for (let i = 0; i < putTiles.length; i++) {
      // We use the code in the next if statement until we reach the last letter
      if (i < putTiles.length - 1) {
        if (putTiles[i].boardIndex === putTiles[i + 1].boardIndex - 1) {
          // It's a match so we move on to the next letter
          continue;
        } else {
          alert(
            "You did not put down your tiles next to eachother. Please try again."
          );
          return false;
        }
        // When we have reached the last letter we do one final check
      } else {
        if (putTiles[i].boardIndex === putTiles[i + 1].boardIndex - 1) {
          return true;
        } else {
          alert(
            "You did not put down your tiles next to eachother. Please try again."
          );
          return false;
        }
      }
    }
  } else {
    alert(
      "You did not put down your tiles next to eachother. Please try again."
    );
    return false;
  }
}
