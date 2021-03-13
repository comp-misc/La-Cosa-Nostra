var mafia = require("../../../../../source/lcn")

var rs = mafia.rolesystem

module.exports = function (actionable, game, params) {
	var target = game.getPlayerByIdentifier(actionable.to)

	rs.prototypes.basicKidnap.reason = "commute"
	var outcome = rs.prototypes.basicCommute(...arguments)

	target.misc.commutes_left--
}

module.exports.TAGS = ["visit"]
