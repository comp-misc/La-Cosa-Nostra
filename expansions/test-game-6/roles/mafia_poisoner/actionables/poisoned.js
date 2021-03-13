var lcn = require("../../../../../source/lcn.js")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	var poisoned = game.getPlayerByIdentifier(actionable.to)
	var poisoner = game.getPlayerByIdentifier(actionable.from)

	if (!poisoned.misc.poisoned === true) {
		return null
	}

	game.addAction("mafia_poisoner/poison_kill", ["cycle"], {
		name: "Poison-kill",
		expiry: 3,
		execution: 3,
		from: actionable.from,
		to: actionable.to,
		attack: actionable.target,
		priority: 4,
		tags: ["poison"],
	})

	game.addMessage(
		poisoned,
		":exclamation: You were poisoned last night! You will die from the poison if you are not cured before tomorrow."
	)

	poisoner.misc.toxicologist_poisons_left--
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]
