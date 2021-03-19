var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Mailman-send",
	})

	var target = game.getPlayerByIdentifier(actionable.to)
	var from = game.getPlayerByIdentifier(actionable.from)

	game.addMessage(
		target,
		":exclamation: You received an anonymous message last night:\n```" + actionable.message + "```"
	)

	from.misc.messenger_messages_left
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]