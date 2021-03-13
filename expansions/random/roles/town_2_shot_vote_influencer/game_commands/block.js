// Register heal

var lcn = require("../../../../../source/lcn.js")

var rs = lcn.rolesystem;

module.exports = function (game, message, params) {

  var actions = game.actions;
  var config = game.config;

  // Run checks, etc

  if (params[0] === undefined) {
    message.channel.send(":x:  Wrong syntax! Please use `" + config["command-prefix"] + "block <alphabet/username/nobody>` instead!");
    return null;
  };

  var to = game.getPlayerMatch(params[0]);
  var from = game.getPlayerById(message.author.id);

  if (from.misc.vote_influencer_influences_left < 1) {
    message.channel.send(":x:  You have no uses left!");
    return null;
  };

  if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {

    actions.delete(x => x.from === from.identifier && (x.identifier === "town_2_shot_vote_influencer/influence" || x.identifier === "town_2_shot_vote_influencer/block"));

    message.channel.send(":bookmark:  You have now selected to not to block nor influence the vote of anyone tonight.");
    return null;
  };

  to = to.player;

  if (!to.isAlive()) {
    message.channel.send(":x:  You cannot block the vote of a dead player!");

    return null;
  };

  if (from.misc.influencer_log[0] === to.identifier) {
    message.channel.send(":x:  You cannot block or influence the vote of the same player consecutively!");

    return null;
  };

  if (to.id === message.author.id) {

    var mention = "yourself";

  } else {

    var mention = to.getDisplayName();

  };

  actions.delete(x => x.from === from.identifier && (x.identifier === "town_2_shot_vote_influencer/influence" || x.identifier === "town_2_shot_vote_influencer/block"));


  game.addAction("town_2_shot_vote_influencer/block", ["cycle"], {
    name: "Influencer-block",
    expiry: 1,
    from: message.author.id,
    to: to.id
  });

  message.channel.send(":bookmark:  You have now selected to block the vote of **" + mention + "** tonight.");
  
};

module.exports.ALLOW_NONSPECIFIC = false;
module.exports.PRIVATE_ONLY = true;
module.exports.DEAD_CANNOT_USE = true;
module.exports.ALIVE_CANNOT_USE = false;
module.exports.DISALLOW_DAY = true;
module.exports.DISALLOW_NIGHT = false;
