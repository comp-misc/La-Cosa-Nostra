// Register heal

import { RoleCommand } from "../../../../../commands/CommandType"
import makeCommand from "../../../../../commands/makeCommand"
import rs from "../../../../../rolesystem/rolesystem"

const investigate: RoleCommand = (game, message, params, from) => {
	const actions = game.actions
	const config = game.config

	// Run checks, etc

	if (params[0] === undefined) {
		message.channel.send(
			":x: Wrong syntax! Please use `" + config["command-prefix"] + "investigate <alphabet/username/nobody>` instead!"
		)
		return
	}

	const to = game.getPlayerMatch(params[0])

	actions.delete((x) => x.from === from.identifier && x.identifier === "consigliere/investigation")

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		message.channel.send(":mag: You have decided not to investigate anyone tonight.")
		return
	}

	if (!to.player.isAlive()) {
		message.channel.send(":x: You cannot investigate a dead player!" + rs.misc.sarcasm(true))
		return
	}

	if (to.player.id === message.author.id) {
		message.channel.send(":x: You cannot investigate yourself!" + rs.misc.sarcasm(true))

		return
	}
	game.addAction("consigliere/investigation", ["cycle"], {
		name: "Consigliere-investigation",
		expiry: 1,
		from: message.author.id,
		to: to.player.id,
	})

	message.channel.send(":mag: You have decided to investigate **" + to.player.getDisplayName() + "** tonight.")
}

investigate.ALLOW_NONSPECIFIC = false
investigate.PRIVATE_ONLY = true
investigate.DEAD_CANNOT_USE = true
investigate.ALIVE_CANNOT_USE = false
investigate.DISALLOW_DAY = true
investigate.DISALLOW_NIGHT = false

export = makeCommand(investigate, {
	name: "investigate",
	description: "Investigates a player",
	usage: "investigate <player | nobody>",
})
