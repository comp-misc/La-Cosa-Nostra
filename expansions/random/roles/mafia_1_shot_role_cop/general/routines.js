var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  if (player.misc.role_cop_checks_left > 0) {
    
    player.game.sendPeriodPin(channel, ":mag_right:  You may check a player tonight.\n\nYou have **" + player.misc.role_cop_checks_left + "** check" + auxils.vocab("s", player.misc.role_cop_checks_left) + " left.\n\nUse `" + config["command-prefix"] + "check <alphabet/name/nobody>` to select your target.");

  } else {

    player.game.sendPeriodPin(channel, ":mag_right:  You have run out of checks.");
  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
