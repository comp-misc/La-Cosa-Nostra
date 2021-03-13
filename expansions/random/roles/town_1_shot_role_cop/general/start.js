// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("town_1_shot_role_cop/roleblock_noresult", ["roleblock"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.misc.role_cop_investigates_left = 1;

};
