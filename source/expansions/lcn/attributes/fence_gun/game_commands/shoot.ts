// Register heal

import { RoleCommand } from "../../../../../commands/CommandType"
import makeCommand from "../../../../../commands/makeCommand"
import rs from "../../../../../rolesystem/rolesystem"

const shoot: RoleCommand = async (game, message, params) => {
	const config = game.config

	// Run checks, etc

	if (params[0] === undefined) {
		message.channel.send(
			":x: Wrong syntax! Please use `" + config["command-prefix"] + "shoot <alphabet/username/nobody>` instead!"
		)
		return
	}

	const to = game.getPlayerMatch(params[0])

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		await message.reply(":x: Not shooting anybody.")
		return
	}

	if (!to.player.isAlive()) {
		await message.reply(":x: You cannot shoot a dead player!" + rs.misc.sarcasm(true))
		return
	}

	if (to.player.id === message.author.id) {
		await message.reply(":x: You cannot shoot yourself!" + rs.misc.sarcasm(true))
		return
	}
	game.addAction("a/fence_gun/shoot", ["instant"], {
		name: "A/Fence-shoot",
		expiry: 1,
		from: message.author.id,
		to: to.player.id,
	})

	await message.reply(":alien: You have decided to probe **" + to.player.getDisplayName() + "** tonight.")
}

shoot.ALLOW_NONSPECIFIC = false
shoot.PRIVATE_ONLY = true
shoot.DEAD_CANNOT_USE = true
shoot.ALIVE_CANNOT_USE = false
shoot.DISALLOW_DAY = false
shoot.DISALLOW_NIGHT = true

export = makeCommand(shoot, {
	name: "shoot",
	description: "Shoots a player",
	usage: "shoot <player | nobody>",
})
