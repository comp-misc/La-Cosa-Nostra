import { RoleCommand } from "../../../../../source/commands/CommandType"
import makeCommand from "../../../../../source/commands/makeCommand"

const lcn = require("../../../../../source/lcn")

// Register heal

const rs = lcn.rolesystem

const kill: RoleCommand = async (game, message, params, from) => {
	const actions = game.actions
	const config = game.config

	// Run checks, etc

	if (params[0] === undefined) {
		message.channel.send(
			":x: Wrong syntax! Please use `" + config["command-prefix"] + "kill <alphabet/username/nobody>` instead!"
		)
		return
	}

	const to = game.getPlayerMatch(params[0])

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		actions.delete(
			(x) =>
				(x.from === from.identifier && x.tags.includes("mafia_factional_side")) ||
				x.tags.includes("mafia_factional_main")
		)

		message.channel.send(":no_entry: You have decided not to use the factional kill.")
		game
			.getChannel("mafia")
			.send(
				":exclamation: **" +
					from.getDisplayName() +
					"** has decided not to kill anyone tonight. No kill will be attempted if no further action is submitted."
			)
		return
	}

	if (!to.player.isAlive()) {
		message.channel.send(":x: You cannot kill a dead player!" + rs.misc.sarcasm(true))
		return
	}

	if (to.player.id === message.author.id) {
		message.channel.send(":x: You cannot kill yourself!" + rs.misc.sarcasm(true))
		return
	} else {
		actions.delete(
			(x) =>
				(x.from === from.identifier && x.tags.includes("mafia_factional_side")) ||
				x.tags.includes("mafia_factional_main")
		)

		game.addAction("a/mafia_factionkill/kill", ["cycle"], {
			name: "Factionkill-kill",
			expiry: 1,
			priority: 6,
			from: message.author.id,
			to: to.player.id,
			tags: ["mafia_factional_main"],
		})
	}

	await message.reply(
		":no_entry: You have decided to use the factional kill on **" + to.player.getDisplayName() + "** tonight."
	)
	game
		.getChannel("mafia")
		.send(
			":exclamation: **" +
				from.getDisplayName() +
				"** is using the factional kill on **" +
				to.player.getDisplayName() +
				"** tonight."
		)
}

kill.ALLOW_NONSPECIFIC = false
kill.PRIVATE_ONLY = true
kill.DEAD_CANNOT_USE = true
kill.ALIVE_CANNOT_USE = false
kill.DISALLOW_DAY = true
kill.DISALLOW_NIGHT = false

export = makeCommand(kill, {
	name: "kill",
	description: "Targets a player to kill",
	usage: "kill <player | nobody>",
})
