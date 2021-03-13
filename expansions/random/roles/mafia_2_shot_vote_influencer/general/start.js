// Executes BEFORE introduction

module.exports = function (player) {

  player.game.addAction("mafia_2_shot_vote_influencer/roleblocked", ["roleblock"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

  player.addAttribute("mafia_factionkill");

  player.misc.vote_influencer_uses_left = 2;

};
