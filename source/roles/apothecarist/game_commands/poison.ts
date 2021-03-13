// Register heal

import { RoleCommand } from "../../../commands/CommandType"
import makeCommand from "../../../commands/makeCommand"
import rs from "../../../rolesystem/rolesystem"

const poison: RoleCommand = (game, message, params) => {
	const actions = game.actions
	const config = game.config

	// Run checks, etc

	if (params[0] === undefined) {
		message.channel.send(
			":x: Wrong syntax! Please use `" + config["command-prefix"] + "poison <alphabet/username/nobody>` instead!"
		)
		return
	}

	const to = game.getPlayerMatch(params[0])
	const from = game.getPlayerByIdOrThrow(message.author.id)

	if (from.misc.apothecarist_poisons_left < 1) {
		message.channel.send(":x: You have run out of poisons!")
		return
	}

	actions.delete((x) => x.from === from.identifier && x.identifier === "apothecarist/poison")

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		message.channel.send(":herb: You have decided not to poison anyone tonight.")
		return
	}

	if (!to.player.isAlive()) {
		message.channel.send(":x: You cannot poison a dead player!" + rs.misc.sarcasm(true))
		return
	}

	if (to.player.id === message.author.id) {
		message.channel.send(":x: You cannot poison yourself!" + rs.misc.sarcasm(true))
		return
	}
	game.addAction("apothecarist/poison", ["cycle"], {
		name: "Apothecarist-poison",
		expiry: 1,
		from: message.author.id,
		to: to.player.id,
	})

	message.channel.send(":herb: You have decided to poison **" + to.player.getDisplayName() + "** tonight.")
}

poison.ALLOW_NONSPECIFIC = false
poison.PRIVATE_ONLY = true
poison.DEAD_CANNOT_USE = true
poison.ALIVE_CANNOT_USE = false
poison.DISALLOW_DAY = true
poison.DISALLOW_NIGHT = false

export = makeCommand(poison, {
	name: "poison",
	description: "Poisons a player",
	usage: "poison <player>",
})
