var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();
  
  if (player.misc.tracker_tracks_left > 0) {
    
    player.game.sendPeriodPin(channel, ":mag_right:  You may choose to track a player tonight.\n\nYou have **" + player.misc.tracker_tracks_left + "** track" + auxils.vocab("s", player.misc.tracker_tracks_left) + " left.\n\nUse `" + config["command-prefix"] + "track <alphabet/name/nobody>` to select your target.");
  
  } else {

    player.game.sendPeriodPin(channel, ":mag_right:  You have run out of tracks.");
  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
