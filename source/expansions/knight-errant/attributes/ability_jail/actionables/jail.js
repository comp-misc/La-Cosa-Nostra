var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	var target = game.getPlayerByIdentifier(actionable.to)

	rs.prototypes.basicKidnap.reason = "abducted"
	var outcome = rs.prototypes.basicKidnap(...arguments)

	rs.modular.attributeDecrement(...arguments)
}

module.exports.TAGS = ["drivable", "visit"]