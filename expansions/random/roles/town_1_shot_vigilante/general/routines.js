var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  if (player.misc.vigilante_kills_left > 0) {
    
    player.game.sendPeriodPin(channel, ":dagger:  You may choose to kill a player tonight.\n\nYou have **" + player.misc.vigilante_kills_left + "** kill" + auxils.vocab("s", player.misc.vigilante_kills_left) + " left.\n\nUse `" + config["command-prefix"] + "kill <alphabet/name/nobody>` to select your target.");
  
  } else {

    player.game.sendPeriodPin(channel, ":dagger:  You have run out of kills.");
  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
