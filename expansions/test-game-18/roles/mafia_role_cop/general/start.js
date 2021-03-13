// Executes BEFORE introduction

module.exports = function (player) {

  player.addAttribute("mafia_factionkill");

  player.game.addAction("mafia_role_cop/roleblock_noresult", ["roleblock"], {
    from: player,
    to: player,
    expiry: Infinity,
    tags: ["permanent"]
  });

};
