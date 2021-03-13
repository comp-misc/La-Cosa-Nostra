// Executes BEFORE introduction

module.exports = function (player) {

  player.misc.jester_lynched = false;

  player.game.addAction("3p_jester/lynched", ["lynch"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

};
