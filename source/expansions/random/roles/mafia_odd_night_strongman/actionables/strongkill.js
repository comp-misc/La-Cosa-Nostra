var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	var outcome = rs.prototypes.unstoppableAttack(...arguments)

	var killer = game.getPlayerByIdentifier(actionable.from)
}

module.exports.TAGS = ["roleblockable", "visit"]