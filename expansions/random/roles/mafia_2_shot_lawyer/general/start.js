// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("mafia_2_shot_lawyer/roleblocked", ["roleblock"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.addAttribute("mafia_factionkill");

  player.misc.lawyer_frames_left = 2;

};
