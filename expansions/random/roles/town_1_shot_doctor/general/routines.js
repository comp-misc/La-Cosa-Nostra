var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  if (player.misc.doctor_protects_left > 0) {
    
    player.game.sendPeriodPin(channel, ":shield:  You may protect a player tonight.\n\nYou have **" + player.misc.doctor_protects_left + "** protect" + auxils.vocab("s", player.misc.doctor_protects_left) + " left.\n\nUse `" + config["command-prefix"] + "protect <alphabet/name/nobody>` to select your target.");
  
  } else {

    player.game.sendPeriodPin(channel, ":shield:  You have run out of protects.");
  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
