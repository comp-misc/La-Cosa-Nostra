var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	var target = game.getPlayerByIdentifier(actionable.to)

	rs.prototypes.basicKidnap.reason = "commute"
	var outcome = rs.prototypes.basicCommute(...arguments)
}

module.exports.TAGS = ["visit"]