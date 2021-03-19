var mafia = require("../../../../../source/lcn.js")

var rs = mafia.rolesystem

module.exports = function (actionable, game, params) {
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Mailman-send",
	})

	var target = game.getPlayerByIdentifier(actionable.to)

	game.addMessage(
		target,
		":exclamation: You received an anonymous message last night:\n```fix\n" + actionable.message + "```"
	)
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]
