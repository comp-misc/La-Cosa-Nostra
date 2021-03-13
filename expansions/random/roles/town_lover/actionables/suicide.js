var lcn = require("../../../../../source/lcn.js")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	// Suicide

	var from = game.getPlayerByIdentifier(actionable.from)
	var killed = game.getPlayerByIdentifier(actionable.to)

	from.misc.suicide = true

	/* Remove other lovers' suicide action,
  no need to create a loop */
	//game.actions.delete(x => x.from === actionable.to && x.identifier === "town_lover/suicide");

	/* Downright kill - this attack is absolute
  and unpreventable by ANY role or action */

	// Set 1 to broadcast offset
	game.silentKill(
		from,
		"found dead, having committed suicide over the loss of their __Lover__",
		"found dead, having committed suicide over the loss of your __Lover__",
		2
	)

	// Destroy this instance
	return true
}
