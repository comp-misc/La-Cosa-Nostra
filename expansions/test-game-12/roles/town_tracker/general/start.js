// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("town_tracker/roleblock_noresult", ["roleblock"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

};
