// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("town_odd_night_alignment_cop/roleblock_noresult", ["roleblock"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

};
