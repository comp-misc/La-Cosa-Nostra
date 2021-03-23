// Register heal
import { RoleCommand } from "../../../../../commands/CommandType"
import makeCommand from "../../../../../commands/makeCommand"
import rs from "../../../../../rolesystem/rolesystem"

const douse: RoleCommand = (game, message, params, from) => {
	const actions = game.actions
	const config = game.config

	// Run checks, etc

	if (params[0] === undefined) {
		message.channel.send(
			":x: Wrong syntax! Please use `" + config["command-prefix"] + "douse <alphabet/username/nobody>` instead!"
		)
		return null
	}

	const to = game.getPlayerMatch(params[0])

	actions.delete(
		(x) => x.from === from.identifier && (x.identifier === "arsonist/douse" || x.identifier === "arsonist/ignite")
	)

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		message.channel.send(":oil: You have decided not to douse anyone tonight nor ignite.")
		return
	}

	if (!to.player.isAlive()) {
		message.channel.send(":x: You cannot douse a dead player!" + rs.misc.sarcasm(true))
		return null
	}

	if (to.player.id === message.author.id) {
		message.channel.send(":x: You cannot douse yourself!" + rs.misc.sarcasm(true))
		return
	}
	game.addAction("arsonist/douse", ["cycle"], {
		name: "Arsonist-douse",
		expiry: 1,
		from: from,
		to: to.player,
	})

	message.channel.send(":oil: You have decided to douse **" + to.player.getDisplayName() + "** tonight.")
}

douse.ALLOW_NONSPECIFIC = false
douse.PRIVATE_ONLY = true
douse.DEAD_CANNOT_USE = true
douse.ALIVE_CANNOT_USE = false
douse.DISALLOW_DAY = true
douse.DISALLOW_NIGHT = false

export = makeCommand(douse, {
	name: "douse",
	description: "Douses a player in oil",
	usage: "douse <player / nobody>",
})
