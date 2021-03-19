// Register heal

var lcn = require("../../../../../source/lcn")

var rs = lcn.rolesystem

module.exports = function (game, message, params) {
	var actions = game.actions
	var config = game.config

	if (game.state !== "playing") {
		message.channel.send(":x:  You cannot haunt a player now!")
		return null
	}

	// Run checks, etc

	if (params[0] === undefined) {
		message.channel.send(
			":x:  Wrong syntax! Please use `" + config["command-prefix"] + "haunt <alphabet/username/nobody>` instead!"
		)
		return null
	}

	var to = game.getPlayerMatch(params[0])
	var from = game.getPlayerById(message.author.id)

	if (from.misc.haunted_jester_haunted) {
		message.channel.send(":x:  You have already used your haunt!")
		return null
	}

	if (!from.misc.haunted_jester_lynched) {
		message.channel.send(":x:  You may not haunt a player!")
		return null
	}

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		actions.delete(
			(x) =>
				x.from === from.identifier &&
				(x.identifier === "3p_haunted_jester/haunt" || x.identifier === "3p_haunted_jester/random_haunt")
		)

		message.channel.send(
			":ghost:  You have now selected to not haunt anyone. A player who has lynched you will be haunted at random."
		)

		game.addAction("3p_haunted_jester/random_haunt", ["cycle"], {
			name: "Jester-random-haunt",
			expiry: 1,
			from: message.author.id,
			to: message.author.id,
			priority: -1,
		})

		return null
	}

	to = to.player

	if (to.id === message.author.id) {
		message.channel.send(":x:  You cannot haunt yourself!")

		return null
	}

	if (!to.isAlive()) {
		message.channel.send(":x:  You cannot haunt a dead player!")
		return null
	}

	if (!from.misc.haunted_jester_lynchers.some((x) => x.identifier === to.identifier)) {
		message.channel.send(":x:  You may not haunt a player who did not vote you in the trial!")
		return null
	}

	actions.delete(
		(x) =>
			x.from === from.identifier &&
			(x.identifier === "3p_haunted_jester/haunt" || x.identifier === "3p_haunted_jester/random_haunt")
	)

	game.addAction("3p_haunted_jester/haunt", ["cycle"], {
		name: "Jester-haunt",
		expiry: 1,
		from: message.author.id,
		to: to.id,
	})

	var mention = to.getDisplayName()

	message.channel.send(":ghost:  You have now selected to haunt **" + mention + "** tonight.")
}

module.exports.ALLOW_NONSPECIFIC = false
module.exports.PRIVATE_ONLY = true
module.exports.DEAD_CANNOT_USE = false
module.exports.ALIVE_CANNOT_USE = true
module.exports.DISALLOW_DAY = true
module.exports.DISALLOW_NIGHT = false
