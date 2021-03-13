var lcn = require("../../../../../source/lcn.js")

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  // Seen as a visit
  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Influencer-stop-vote"});

  game.addAction("town_nonconsecutive_vote_influencer/stop_vote", ["postcycle"], {
    name: "Influencer-stop-vote",
    expiry: 2,
    from: actionable.from,
    to: actionable.to
  });

  var influencer = game.getPlayerByIdentifier(actionable.from);

  influencer.misc.consecutive_night = true;

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
