var lcn = require("../../../../../source/lcn.js");

// Register heal

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  if (game.getPeriod() % 4 !== 1) {
    message.channel.send(":x:  You may only watch on odd nights!");
  
    return null;
  };

  // Run checks, etc

  if (params[0] === undefined) {
    message.channel.send(":x:  Wrong syntax! Please use `" + config["command-prefix"] + "watch <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);
  var from = game.getPlayerById(message.author.id);

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {

    actions.delete(x => x.from === from.identifier && x.identifier === "mafia_odd_night_watcher/watch");

    message.channel.send(":telescope:  You have now selected to not watch anyone tonight.");
    game.getChannel("mafia").send(":telescope:  **" + from.getDisplayName() + "** is not watching anyone tonight.");
    return null;
  };

  to = to.player;

  if (!to.isAlive()) {
    message.channel.send(":x:  You cannot watch a dead player!");
    return null;
  };

  if (to.id === message.author.id) {

    message.channel.send(":x:  You cannot watch yourself!");

    return null;

  } else {

    actions.delete(x => x.from === from.identifier && x.identifier === "mafia_odd_night_watcher/watch");

    game.addAction("mafia_odd_night_watcher/watch", ["cycle"], {
      name: "Watcher-watch",
      expiry: 1,
      from: message.author.id,
      to: to.id
    });

    var mention = to.getDisplayName();

  };

  message.channel.send(":telescope:  You have now selected to watch **" + mention + "** tonight.");
  game.getChannel("mafia").send(":telescope:  **" + from.getDisplayName() + "** is watching **" + mention + "** tonight.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
