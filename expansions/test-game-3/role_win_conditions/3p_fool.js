var mafia = require("../../../source/lcn.js")

var auxils = mafia.auxils;

module.exports = function (game) {

  var fools = game.findAll(x => x.role_identifier === "3p_fool" && !x.isAlive() && x.misc.fool_lynched === true && !x.hasWon());

  if (fools.length > 0) {

    var winners = fools.filter(x => x.canWin());

    game.setWins(winners);
    game.getMainChannel().send(auxils.getAssetAttachment("fool-wins.png"));
    game.primeWinLog("fool", "The Fool has successfully got themself lynched, to town's full embarrassement.");


    return true;
  };

  return false;

};

module.exports.STOP_GAME = true;
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
