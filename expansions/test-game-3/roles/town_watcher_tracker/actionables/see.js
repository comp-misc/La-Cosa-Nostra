var mafia = require("../../../../../source/lcn.js");

var rs = mafia.rolesystem;
var auxils = mafia.auxils;

module.exports = function (actionable, game, params) {

  // Visit the target
  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "God-of-doors-watch"});

  game.addAction("town_watcher_tracker/gather", ["cycle"], {
    name: "God-of-doors-gather",
    expiry: 1,
    from: actionable.from,
    to: actionable.to,
    priority: 12
  });

};

module.exports.TAGS = ["roleblockable", "drivable", "visit"];
