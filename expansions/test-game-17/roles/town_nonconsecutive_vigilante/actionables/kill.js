var lcn = require("../../../../../source/lcn")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	var outcome = rs.prototypes.basicAttack(...arguments)

	var from = game.getPlayerByIdentifier(actionable.from)

	from.misc.consecutive_night = true
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]
