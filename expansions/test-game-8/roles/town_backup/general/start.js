// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("town_backup/promotion", ["cycle"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"],
    priority: 10
  });

};
