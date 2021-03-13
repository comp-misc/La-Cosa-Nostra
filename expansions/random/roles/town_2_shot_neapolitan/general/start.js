// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("town_2_shot_neapolitan/roleblock_noresult", ["roleblock"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.misc.neapolitan_investigates_left = 2;

};
