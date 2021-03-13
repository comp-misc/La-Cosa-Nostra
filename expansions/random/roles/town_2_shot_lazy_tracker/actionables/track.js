var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;
var auxils = lcn.auxils;

module.exports = function (actionable, game, params) {

  var from = game.getPlayerByIdentifier(actionable.from);

  // Visit the target
  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Tracker-track"});

  game.addAction("town_2_shot_lazy_tracker/gather", ["cycle"], {
    name: "Tracker-gather",
    expiry: 1,
    from: actionable.from,
    to: actionable.to,
    priority: 12
  });

  from.misc.lazy_tracker_tracks_left--;

};

module.exports.TAGS = ["roleblockable", "drivable", "visit"];
