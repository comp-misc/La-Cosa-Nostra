// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("town_cupid/roleblocked", ["roleblock"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.misc.cupid_matches = 1;

};
