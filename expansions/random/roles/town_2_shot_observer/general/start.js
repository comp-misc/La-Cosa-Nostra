// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("town_2_shot_observer/roleblock_noresult", ["roleblock"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.misc.observer_observes_left = 2;

};
