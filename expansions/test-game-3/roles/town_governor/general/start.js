// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("town_governor/arbiter_modifier", ["cycle"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.misc.executions = 1;

};
