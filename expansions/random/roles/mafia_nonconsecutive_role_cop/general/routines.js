var lcn = require("../../../../../source/lcn.js");

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils;

module.exports = function (player) {

  var config = player.game.config;

  // Nighttime actions
  var channel = player.getPrivateChannel();

  player.game.addAction("mafia_nonconsecutive_role_cop/no_action", ["cycle"], {
    name: "SE-no_action",
    expiry: 1,
    from: player,
    to: player
  });

  if (player.misc.consecutive_night === false) {  
    player.game.sendPeriodPin(channel, ":mag_right:  You may check a player tonight.\n\nUse `" + config["command-prefix"] + "check <alphabet/name/nobody>` to select your target.");
  } else {
    player.game.sendPeriodPin(channel, ":mag_right:  You may not check a player tonight.");
  };

};

module.exports.ALLOW_DEAD = false;
module.exports.ALLOW_NIGHT = true;
module.exports.ALLOW_DAY = false;
