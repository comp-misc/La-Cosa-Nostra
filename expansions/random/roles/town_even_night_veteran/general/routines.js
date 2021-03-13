// Routines
// Runs every cycle

// Function should be synchronous

var lcn = require("../../../../../source/lcn.js");

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  if (player.game.getPeriod() % 4 === 3) {
    player.game.sendPeriodPin(channel, ":triangular_flag_on_post:  You may choose to go on alert tonight.\n\nUse `" + config["command-prefix"] + "alert` to go on alert and `" + config["command-prefix"] + "deselect` to choose not to go on alert.")
  } else {
    player.game.sendPeriodPin(channel, ":triangular_flag_on_post:  You may not go on alert tonight.");
  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
