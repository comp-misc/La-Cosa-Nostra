var lcn = require("../../../../../source/lcn")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	var target = game.getPlayerByIdentifier(actionable.to)

	rs.prototypes.basicKidnap.reason = "commute"
	var outcome = rs.prototypes.basicCommute(...arguments)

	var from = game.getPlayerByIdentifier(actionable.from)

	from.misc.consecutive_night = true
}

module.exports.TAGS = ["visit"]
