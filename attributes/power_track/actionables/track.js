var rs = require("../../../rolesystem/rolesystem.js");
var auxils = require("../../../systems/auxils.js");

module.exports = function (actionable, game, params) {

  // Visit the target
  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Modular-visit"});

  game.addAction("a/power_track/gather", ["cycle"], {
    name: "Modular-gather",
    expiry: 1,
    from: actionable.from,
    to: actionable.to,
    priority: 12
  });

  rs.modular.attributeDecrement(...arguments);

};

module.exports.TAGS = ["roleblockable", "drivable", "visit"];