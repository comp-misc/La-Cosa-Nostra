// Executes BEFORE introduction

module.exports = function (player) {

  player.misc.oracle_last_target = null;

  player.game.addAction("town_nonconsecutive_oracle/reveal", ["killed"], {
    name: "Oracle-reveal",
    expiry: Infinity,
    from: player,
    to: player,
    tags: ["permanent"]
  });

  player.game.addAction("town_nonconsecutive_oracle/roleblocked", ["roleblock"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.misc.consecutive_night = false;

};
