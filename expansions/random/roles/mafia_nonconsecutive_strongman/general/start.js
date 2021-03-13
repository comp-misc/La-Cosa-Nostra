// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("mafia_nonconsecutive_strongman/roleblocked", ["roleblock"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.addAttribute("mafia_factionkill");

  player.misc.consecutive_night = false;

};
