// Register heal

import createTargetCommand, { TargetRoleCommand } from "../../../../../commands/createTargetCommand"

const command: TargetRoleCommand = async (game, message, target, from) => {
	const actions = game.actions
	actions.delete((x) => x.from === from.identifier && x.identifier === "alien/probe")

	if (target === "nobody") {
		await message.reply(":alien: You have decided not to probe anyone tonight.")
		return
	}

	game.addAction("alien/probe", ["cycle"], {
		name: "Alien-probe",
		expiry: 1,
		from,
		to: target,
	})

	await message.reply(":alien: You have decided to probe **" + target.getDisplayName() + "** tonight.")
}

command.ALLOW_NONSPECIFIC = false
command.PRIVATE_ONLY = true
command.DEAD_CANNOT_USE = true
command.ALIVE_CANNOT_USE = false
command.DISALLOW_DAY = true
command.DISALLOW_NIGHT = false

export = createTargetCommand(command, {
	name: "probe",
	description: "Allows you to probe for abductions",
	usage: "probe <player>",
})
