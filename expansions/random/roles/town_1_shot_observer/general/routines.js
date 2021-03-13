var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  if (player.misc.observer_observes_left > 0) {
    
    player.game.sendPeriodPin(channel, ":telescope:  You may choose a player to observe tonight.\n\nYou have **" + player.misc.observer_observes_left + "** observe" + auxils.vocab("s", player.misc.observer_observes_left) + " left.\n\nUse `" + config["command-prefix"] + "observe <alphabet/name/nobody>` to select your target.");
  
  } else {

    player.game.sendPeriodPin(channel, ":telescope:  You have run out of observes.");
  };


};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
