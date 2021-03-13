var lcn = require("../../../../../source/lcn")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	var target = game.getPlayerByIdentifier(actionable.to)
	var alien = game.getPlayerByIdentifier(actionable.from)

	rs.prototypes.basicKidnap.reason = "abducted"
	var outcome = rs.prototypes.basicKidnap(...arguments)

	alien.misc.kidnapper_kidnaps_left--
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]
