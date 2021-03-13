var mafia = require("../../../../../source/lcn.js")

var rs = mafia.rolesystem

module.exports = function (actionable, game, params) {
	// Target was attacked
	var cleaned = game.getPlayerByIdentifier(actionable.to)
	var cleaner = game.getPlayerByIdentifier(actionable.from)

	cleaned.misc.role_cleaned = true

	cleaned.setDisplayRole("Cleaned")

	cleaned.setPrecedentWill(null)

	cleaner.misc.janitor_cleans_left--

	return true
}
