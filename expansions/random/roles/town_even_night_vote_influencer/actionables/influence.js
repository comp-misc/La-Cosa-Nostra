var lcn = require("../../../../../source/lcn.js")

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  // Seen as a visit
  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Influencer-double-vote"});

  game.addAction("town_even_night_vote_influencer/double_vote", ["postcycle"], {
    name: "Influencer-double-vote",
    expiry: 2,
    from: actionable.from,
    to: actionable.to
  });

  var influencer = game.getPlayerByIdentifier(actionable.from);

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
