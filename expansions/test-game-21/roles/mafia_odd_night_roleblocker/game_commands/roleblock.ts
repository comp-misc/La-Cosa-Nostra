import { RoleCommand } from "../../../../../commands/CommandType"

// Register heal

const roleblock: RoleCommand = (game, message, params) => {
	const actions = game.actions
	const config = game.config

	if (game.getPeriod() % 4 !== 1) {
		message.channel.send(":x:  You may only roleblock a player on odd nights!")

		return null
	}

	// Run checks, etc

	if (params[0] === undefined) {
		message.channel.send(
			":x:  Wrong syntax! Please use `" + config["command-prefix"] + "roleblock <alphabet/username/nobody>` instead!"
		)
		return null
	}

	const to = game.getPlayerMatch(params[0])
	const from = game.getPlayerByIdOrThrow(message.author.id)

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		actions.delete((x) => x.from === from.identifier && x.identifier === "mafia_odd_night_roleblocker/roleblock")

		message.channel.send(":no_entry_sign:  You have now selected to not roleblock anyone tonight.")
		game
			.getChannel("mafia")
			.send(":no_entry_sign:  **" + from.getDisplayName() + "** is not roleblocking anyone tonight.")
		return null
	}

	if (!to.player.isAlive()) {
		message.channel.send(":x:  You cannot roleblock a dead player!")
		return null
	}

	if (to.player.id === message.author.id) {
		message.channel.send(":x:  You cannot roleblock yourself!")
		return
	}
	actions.delete((x) => x.from === from.identifier && x.identifier === "mafia_odd_night_roleblocker/roleblock")

	game.addAction("mafia_odd_night_roleblocker/roleblock", ["cycle"], {
		name: "Mafia-roleblocker-roleblock",
		expiry: 1,
		from: message.author.id,
		to: to.player.id,
		tags: ["mafia_factional_side"],
	})

	message.channel.send(
		":no_entry_sign:  You have now selected to roleblock **" + to.player.getDisplayName() + "** tonight."
	)
	game
		.getChannel("mafia")
		.send(
			":no_entry_sign:  **" +
				from.getDisplayName() +
				"** is roleblocking **" +
				to.player.getDisplayName() +
				"** tonight."
		)
}

roleblock.ALLOW_NONSPECIFIC = false
roleblock.PRIVATE_ONLY = true
roleblock.DEAD_CANNOT_USE = true
roleblock.ALIVE_CANNOT_USE = false
roleblock.DISALLOW_DAY = true
roleblock.DISALLOW_NIGHT = false

export = roleblock