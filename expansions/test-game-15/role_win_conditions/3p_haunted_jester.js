module.exports = function (game) {

  var haunted_jesters = game.findAll(x => x.role_identifier === "3p_haunted_jester" && !x.isAlive() && x.misc.haunted_jester_lynched === true && !x.hasWon());

  if (haunted_jesters.length > 0) {

    var winners = haunted_jesters.filter(x => x.canWin());

    game.setWins(winners);
    return true;
  };

  return false;

};

module.exports.STOP_GAME = false;
module.exports.STOP_CHECKS = false;

module.exports.FACTIONAL = false;

module.exports.PRIORITY = 0;
module.exports.CHECK_ONLY_WHEN_GAME_ENDS = false;

// Accepts function
// Should key in wrt to player
module.exports.ELIMINATED = [];
module.exports.SURVIVING = [];

module.exports.PREVENT_CHECK_ON_WIN = [];

module.exports.DESCRIPTION = "Get yourself lynched at all costs.";
