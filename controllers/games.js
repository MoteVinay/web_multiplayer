const Game = require("../models/game");

async function findFriendsByPlayer(name) {
  try {
    // Find games where the given name is in the list of friends
    const games = await Game.find({ friends: name });
    // console.log(games);
    // Set to store other friends
    const otherFriendsSet = new Set();

    // Iterate over the found games
    games.forEach((game) => {
      // Add all other friends to the set
      game.friends.forEach((friend) => {
        if (friend !== name) {
          otherFriendsSet.add(friend);
        }
      });
    });

    return Array.from(otherFriendsSet); // Convert set to array and return
  } catch (error) {
    console.error("Error finding and adding friends:", error);
    throw error;
  }
}

module.exports = {
  findFriendsByPlayer,
};
