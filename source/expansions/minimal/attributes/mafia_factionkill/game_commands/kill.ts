import { CommandUsageError, RoleCommand } from "../../../../../commands/CommandType"
import makeCommand from "../../../../../commands/makeCommand"
import rs from "../../../../../rolesystem/rolesystem"

const ACTION_ID = "a/mafia_factionkill/kill"

const kill: RoleCommand = async (game, message, params, from) => {
	if (params.length === 0) {
		throw new CommandUsageError("Must specify the player")
	}
	const playerName = params.join(" ")
	if (playerName.toLowerCase() === "nobody") {
		game.actions.delete((action) => action.identifier === ACTION_ID && action.from === from.identifier)
		await message.channel.send(":no_entry: You have decided not to use the factional kill.")
		await game
			.getChannel("mafia")
			.send(
				":exclamation: **" +
					from.getDisplayName() +
					"** has decided not to kill anyone tonight. No kill will be attempted if no further action is submitted."
			)
		return
	}

	const to = game.getPlayerMatch(params[0])
	if (to.score < 0.7) {
		return await message.reply(":exclamation: Unknown player")
	}

	if (!to.player.isAlive()) {
		return await message.channel.send(":x: You cannot kill a dead player!" + rs.misc.sarcasm(true))
	}

	if (to.player.id === message.author.id) {
		return await message.channel.send(":x: You cannot kill yourself!" + rs.misc.sarcasm(true))
	}

	game.actions.delete((action) => action.identifier === ACTION_ID && action.from === from.identifier)
	game.addAction(ACTION_ID, ["cycle"], {
		name: "Factionkill-kill",
		expiry: 1,
		priority: 6,
		from: from,
		to: to.player,
	})

	await message.reply(
		":no_entry: You have decided to use the factional kill on **" + to.player.getDisplayName() + "** tonight."
	)
	await game
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
	description: "Targets a player to factionally kill",
	usage: "kill <player | nobody>",
})
