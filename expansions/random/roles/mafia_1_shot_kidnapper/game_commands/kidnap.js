// Register heal

var lcn = require("../../../../../source/lcn.js")

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  if (params[0] === undefined) {
    message.channel.send(":x:  Wrong syntax! Please use `" + config["command-prefix"] + "kidnap <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);
  var from = game.getPlayerById(message.author.id);

  if (from.misc.kidnapper_kidnaps_left < 1) {
    message.channel.send(":x:  You have no uses left!");
    return null;
  };

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {

    actions.delete(x => x.from === from.identifier && x.identifier === "mafia_1_shot_kidnapper/kidnap");

    message.channel.send(":helicopter:  You have now selected to not kidnap anyone tonight.");
    game.getChannel("mafia").send(":helicopter:  **" + from.getDisplayName() + "** is not kidnapping anyone tonight.");
    return null;
  };

  to = to.player;

  if (!to.isAlive()) {
    message.channel.send(":x:  You cannot kidnap a dead player!");
    return null;
  };

  if (to.id === message.author.id) {

    message.channel.send(":x:  You cannot kidnap yourself!");

    return null;

  } else {

    actions.delete(x => x.from === from.identifier && x.identifier === "mafia_1_shot_kidnapper/kidnap");

    game.addAction("mafia_1_shot_kidnapper/kidnap", ["cycle"], {
      name: "Detainer-detain",
      expiry: 1,
      from: message.author.id,
      to: to.id
    });

    var mention = to.getDisplayName();

  };

  message.channel.send(":helicopter:  You have now selected to kidnap **" + mention + "** tonight.");
  game.getChannel("mafia").send(":helicopter:  **" + from.getDisplayName() + "** is kidnapping **" + mention + "** tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
