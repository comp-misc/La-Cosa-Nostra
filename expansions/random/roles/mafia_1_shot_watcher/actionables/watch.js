var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;
var auxils = lcn.auxils;

module.exports = function (actionable, game, params) {

  // Astral
  game.addAction("mafia_1_shot_watcher/gather", ["cycle"], {
    name: "watcher-gather",
    expiry: 1,
    from: actionable.from,
    to: actionable.to,
    priority: 12
  });

  var from = game.getPlayerByIdentifier(actionable.from);

  from.misc.watcher_watches_left--;

};

module.exports.TAGS = ["roleblockable", "drivable", "visit"];
