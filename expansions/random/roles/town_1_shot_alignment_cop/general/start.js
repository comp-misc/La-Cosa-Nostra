// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("town_1_shot_alignment_cop/roleblock_noresult", ["roleblock"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.misc.cop_investigations_left = 1;

};
