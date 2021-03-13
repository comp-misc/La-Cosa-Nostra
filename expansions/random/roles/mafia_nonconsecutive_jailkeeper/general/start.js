// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("mafia_nonconsecutive_jailkeeper/roleblocked", ["roleblock"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.addAttribute("mafia_factionkill");

  player.misc.consecutive_night = false;

};
