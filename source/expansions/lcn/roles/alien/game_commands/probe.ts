// Register heal

import { RoleCommand } from "../../../../../commands/CommandType"
import makeCommand from "../../../../../commands/makeCommand"
import rs from "../../../../../rolesystem/rolesystem"

const command: RoleCommand = async (game, message, params) => {
	const actions = game.actions
	const config = game.config

	// Run checks, etc

	if (params[0] === undefined) {
		await message.reply(
			":x: Wrong syntax! Please use `" + config["command-prefix"] + "probe <alphabet/username/nobody>` instead!"
		)
		return
	}

	const to = game.getPlayerMatch(params[0])
	const from = game.getPlayerByIdOrThrow(message.author.id)

	actions.delete((x) => x.from === from.identifier && x.identifier === "alien/probe")

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		await message.reply(":alien: You have decided not to probe anyone tonight.")
		return
	}

	const toPlayer = to.player

	if (!toPlayer.isAlive()) {
		await message.reply(":x: You cannot probe a dead player!" + rs.misc.sarcasm(true))
		return
	}

	if (toPlayer.id === message.author.id) {
		await message.reply(":x: You cannot probe yourself!" + rs.misc.sarcasm(true))
		return
	}
	game.addAction("alien/probe", ["cycle"], {
		name: "Alien-probe",
		expiry: 1,
		from: message.author.id,
		to: toPlayer.id,
	})

	await message.reply(":alien: You have decided to probe **" + toPlayer.getDisplayName() + "** tonight.")
}

command.ALLOW_NONSPECIFIC = false
command.PRIVATE_ONLY = true
command.DEAD_CANNOT_USE = true
command.ALIVE_CANNOT_USE = false
command.DISALLOW_DAY = true
command.DISALLOW_NIGHT = false

export = makeCommand(command, {
	name: "probe",
	description: "Allows you to probe for abductions",
	usage: "probe <player>",
})
