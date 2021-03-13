var lcn = require("../../../../../source/lcn.js");

// Register heal

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  if (params[0] === undefined) {
    message.channel.send(":x:  Wrong syntax! Please use `" + config["command-prefix"] + "strongkill <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);
  var from = game.getPlayerById(message.author.id);

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {

    actions.delete(x => x.from === from.identifier && x.identifier === "mafia_strongman/strongkill");
    
    message.channel.send(":knife:  You have now selected to not strongkill anyone tonight.");
    game.getChannel("mafia").send(":knife:  **" + from.getDisplayName() + "** is not strongkilling anyone tonight.");
    return null;
  };

  to = to.player;

  if (!to.isAlive()) {
    message.channel.send(":x:  You cannot roleblock a dead player!");
    return null;
  };

  if (to.id === message.author.id) {

    message.channel.send(":x:  You cannot roleblock yourself!");

    return null;

  } else {

    actions.delete(x => x.from === from.identifier && x.identifier === "mafia_strongman/strongkill");
    
    game.addAction("mafia_strongman/strongkill", ["cycle"], {
      name: "Mafia-two-shot-strongman-strongkill",
      expiry: 1,
      from: message.author.id,
      to: to.id,
      tags: ["mafia_factional_side"]
    });

    var mention = to.getDisplayName();

  };

  message.channel.send(":knife:  You have now selected to strongkill **" + mention + "** tonight.");
  game.getChannel("mafia").send(":knife:  **" + from.getDisplayName() + "** is using a strongkill on **" + mention + "** tonight. The factional kill needs to be used in addition to the clean action.");

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
