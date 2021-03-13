// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("mafia_2_shot_doctor/roleblocked", ["roleblock"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.addAttribute("mafia_factionkill");

  player.addAttribute("protection", Infinity, {amount: 1});

  player.misc.doctor_protects_left = 2;

};
