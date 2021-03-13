// Register heal

var lcn = require("../../../../../source/lcn.js")

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  if (params[0] === undefined) {
    message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "interrogate <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);
  var from = game.getPlayerById(message.author.id);

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {

    actions.delete(x => x.from === from.identifier && x.identifier === "town_interrogator/interrogate");

    message.channel.send(":cop: You have decided not to interrogate anyone tonight.");
    return null;
  };

  to = to.player;

  if (!to.isAlive()) {
    message.channel.send(":x: You cannot interrogate a dead player!" + rs.misc.sarcasm(true));
    return null;
  };

  if (to.id === message.author.id) {

    message.channel.send(":x: You cannot interrogate yourself!" + rs.misc.sarcasm(true));

    return null;

  } else {

    actions.delete(x => x.from === from.identifier && x.identifier === "town_interrogator/interrogate");

    game.addAction("town_interrogator/interrogate", ["cycle"], {
      name: "Sheriff-interrogation",
      expiry: 1,
      from: message.author.id,
      to: to.id,
	  target: to.id
    });

    var mention = to.getDisplayName();

  };

  message.channel.send(":cop: You have decided to interrogate **" + mention + "** tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = false;
module.exports.DISALLOW_NIGHT = true;
