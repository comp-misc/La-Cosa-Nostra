// Executes BEFORE introduction

module.exports = function (player) {

  player.addAttribute("mafia_factionkill");

  player.misc.toxicologist_poisons_left = 2;

};
