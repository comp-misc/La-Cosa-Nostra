var mafia = require("../../../../../source/lcn.js");

var rs = mafia.rolesystem;

module.exports = function (actionable, game, params) {

  var outcome = rs.prototypes.unstoppableAttack(...arguments);

  var killer = game.getPlayerByIdentifier(actionable.from);

  killer.misc.strongkills_left--;

};

module.exports.TAGS = ["visit"];
