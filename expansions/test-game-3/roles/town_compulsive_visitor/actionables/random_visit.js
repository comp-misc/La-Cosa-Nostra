var mafia = require("../../../../../source/lcn.js")

var rs = mafia.rolesystem
var auxils = mafia.auxils

module.exports = function (actionable, game, params) {
	var visitor = game.getPlayerByIdentifier(actionable.from)

	var alive = game.findAll((x) => x.isAlive() && x.identifier !== actionable.from)

	var target = auxils.choice(alive)

	game.addMessage(
		visitor,
		":exclamation: You did not pick a target! As a result, **" +
			target.getDisplayName() +
			"** has been selected and you have visited them!"
	)

	// Revert back to original haunt
	game.addAction("town_compulsive_visitor/visit", ["cycle"], {
		name: "Compulsive-Visitor-visit",
		expiry: 1,
		from: actionable.from,
		to: target.identifier,
	})

	return true
}
