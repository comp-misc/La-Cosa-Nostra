// Routines
// Runs every cycle

// Function should be synchronous

var lcn = require("../../../../../source/lcn.js");

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  player.game.sendPeriodPin(channel, ":bookmark:  You may choose to double a player's vote strength or null it for tomorrow.\n\nUse `" + config["command-prefix"] + "influence <alphabet/name/nobody>` to double the vote strength of your selected target.\nUse `" + config["command-prefix"] + "block <alphabet/name/nobody>` to null the vote of your selected target.\n\nYou may only do either action.");

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
