// Register heal

import { RoleCommand } from "../../../../../commands/CommandType"
import makeCommand from "../../../../../commands/makeCommand"
import rs from "../../../../../rolesystem/rolesystem"

const pick: RoleCommand = (game, message, params, from) => {
	const actions = game.actions
	const config = game.config

	// Run checks, etc

	if (from.misc.assassin_picked_target) {
		message.channel.send(":x: You already picked your target!")
		return null
	}

	if (params[0] === undefined) {
		message.channel.send(
			":x: Wrong syntax! Please use `" + config["command-prefix"] + "pick <alphabet/username/nobody>` instead!"
		)
		return null
	}

	const to = game.getPlayerMatch(params[0])

	actions.delete(
		(x) => x.from === from.identifier && (x.identifier === "arsonist/douse" || x.identifier === "arsonist/ignite")
	)

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		message.channel.send(":dagger: You have decided not to pick a victim tonight.")
		return null
	}

	if (!to.player.isAlive()) {
		message.channel.send(":x: You cannot pick a dead player!" + rs.misc.sarcasm(true))
		return null
	}

	if (to.player.id === message.author.id) {
		message.channel.send(":x: You cannot pick yourself!" + rs.misc.sarcasm(true))

		return
	}
	game.addAction("assassin/pick_target", ["cycle"], {
		name: "Assassin-pick-target",
		expiry: 1,
		from,
		to: to.player,
	})

	message.channel.send(":dagger: You have decided to pick **" + to.player.getDisplayName() + "** as your victim.")
}

pick.ALLOW_NONSPECIFIC = false
pick.PRIVATE_ONLY = true
pick.DEAD_CANNOT_USE = true
pick.ALIVE_CANNOT_USE = false
pick.DISALLOW_DAY = true
pick.DISALLOW_NIGHT = false

export = makeCommand(pick, {
	name: "pick",
	description: "Picks a player for assassination",
	usage: "pick <player | nobody>",
})
