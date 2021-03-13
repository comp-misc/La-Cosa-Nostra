// Register heal

var lcn = require("../../../../../source/lcn.js")

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  var from = game.getPlayerById(message.author.id);

  if (from.misc.consecutive_night === true) {

    return null;
  };

  var already_alerting = actions.exists(x => x.from === from.identifier && x.identifier === "town_nonconsecutive_veteran/alert");

  if (!already_alerting) {
    message.channel.send(":x:  You have already selected to not be alert tonight. Use `" + config["command-prefix"] + "alert` to choose to be alert!");
    return null;
  };

  actions.delete(x => x.from === from.identifier && x.identifier === "town_nonconsecutive_veteran/alert");

  message.channel.send(":triangular_flag_on_post:  You have now selected to not be alert tonight.");

  game.addAction("town_nonconsecutive_veteran/no_action", ["cycle"], {
    name: "SE-no_action",
    expiry: 1,
    from: message.author.id,
    to: message.author.id
  });

};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
