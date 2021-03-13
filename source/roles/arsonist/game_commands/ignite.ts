// Register heal

import { RoleCommand } from "../../../commands/CommandType"
import makeCommand from "../../../commands/makeCommand"

const ignite: RoleCommand = (game, message, _params, from) => {
	const actions = game.actions

	actions.delete(
		(x) => x.from === from.identifier && (x.identifier === "arsonist/douse" || x.identifier === "arsonist/ignite")
	)

	message.channel.send(":fire: You have decided to ignite tonight.")

	/*Ignition runs at a much higher priority
  - this is to allow Firefighter to possibly extinguish target
  first */

	game.addAction("arsonist/ignite", ["cycle"], {
		name: "Arsonist-ignition",
		expiry: 1,
		from: message.author.id,
		to: message.author.id,
		priority: 8,
	})
}

ignite.ALLOW_NONSPECIFIC = false
ignite.PRIVATE_ONLY = true
ignite.DEAD_CANNOT_USE = true
ignite.ALIVE_CANNOT_USE = false
ignite.DISALLOW_DAY = true
ignite.DISALLOW_NIGHT = false

export = makeCommand(ignite, {
	name: "ignite",
	description: "Ignites all douses players",
})
