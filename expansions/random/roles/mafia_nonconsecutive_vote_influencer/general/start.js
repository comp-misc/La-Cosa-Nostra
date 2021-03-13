// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("mafia_nonconsecutive_vote_influencer/roleblocked", ["roleblock"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.addAttribute("mafia_factionkill");

  player.misc.consecutive_night = false;

};
