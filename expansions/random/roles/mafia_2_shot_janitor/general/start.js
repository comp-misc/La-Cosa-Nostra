// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("mafia_2_shot_janitor/roleblocked", ["roleblock"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.addAttribute("mafia_factionkill");

  player.misc.janitor_cleans_left = 2;

};
