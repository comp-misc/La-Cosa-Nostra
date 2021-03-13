// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("town_even_night_observer/roleblock_noresult", ["roleblock"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

};
