var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	// Target was attacked
	var cleaned = game.getPlayerByIdentifier(actionable.to)
	var cleaner = game.getPlayerByIdentifier(actionable.from)

	cleaned.misc.role_cleaned = true

	cleaned.setDisplayRole("cleaned")

	cleaned.setPrecedentWill(null)

	return true
}