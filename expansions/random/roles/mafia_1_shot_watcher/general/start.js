// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("mafia_1_shot_watcher/roleblock_noresult", ["roleblock"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.addAttribute("mafia_factionkill");

  player.misc.watcher_watches_left = 1;

};
