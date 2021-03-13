var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var from = game.getPlayerByIdentifier(actionable.from);

  var outcome = rs.prototypes.basicAttack(...arguments);

  from.misc.vigilante_kills_left--;

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
