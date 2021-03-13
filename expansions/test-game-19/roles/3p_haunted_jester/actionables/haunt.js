var lcn = require("../../../../../source/lcn.js")

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  rs.prototypes.unstoppableAttack.reason = "haunted by a __Jester__";

  var haunted_jester = game.getPlayerByIdentifier(actionable.from);

  haunted_jester.misc.haunted_jester_haunted = true;

  // Astral
  var outcome = rs.prototypes.unstoppableAttack(...arguments, true);

  if (!outcome) {

    game.addMessage(haunted_jester, ":exclamation: Your target could not be haunted last night!");

  };

};

module.exports.TAGS = ["drivable"];
