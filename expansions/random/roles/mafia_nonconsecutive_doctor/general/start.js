// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("mafia_nonconsecutive_doctor/roleblocked", ["roleblock"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.addAttribute("mafia_factionkill");

  player.addAttribute("protection", Infinity, {amount: 1});

  player.misc.consecutive_night = false;

};
