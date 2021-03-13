var lcn = require("../../../../../source/lcn.js");

// Register heal

var lcn = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;
  
  var from = game.getPlayerById(message.author.id);

  if (from.misc.consecutive_night === true) {
    message.channel.send(":x:  You may not use an action on two consecutive nights!");

    return null;
  };

  // Run checks, etc

  if (params[0] === undefined) {
    message.channel.send(":x:  Wrong syntax! Please use `" + config["command-prefix"] + "observe <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);
  
  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {

    actions.delete(x => x.from === from.identifier && (x.identifier === "town_nonconsecutive_observer/observe" || x.identifier === "town_nonconsecutive_observer/no_action"));

    game.addAction("town_nonconsecutive_observer/no_action", ["cycle"], {
      name: "SE-no_action",
      expiry: 1,
      from: message.author.id,
      to: message.author.id
    });

    message.channel.send(":telescope:  You have now selected to not observe anyone tonight.");
    return null;
  };

  to = to.player;

  if (!to.isAlive()) {
    message.channel.send(":x:  You cannot observe a dead player!");
    return null;
  };

  if (to.id === message.author.id) {

    message.channel.send(":x:  You cannot observe yourself!");

    return null;

  } else {

    actions.delete(x => x.from === from.identifier && (x.identifier === "town_nonconsecutive_observer/observe" || x.identifier === "town_nonconsecutive_observer/no_action"));

    game.addAction("town_nonconsecutive_observer/observe", ["cycle"], {
      name: "God-of-Doors-investigation",
      expiry: 1,
      from: message.author.id,
      to: to.id
    });

    var mention = to.getDisplayName();

  };

  message.channel.send(":telescope:  You have now selected to observe **" + mention + "** tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
