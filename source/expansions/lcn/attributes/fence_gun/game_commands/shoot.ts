// Register heal

import createTargetCommand, { TargetRoleCommand } from "../../../../../commands/createTargetCommand"

const shoot: TargetRoleCommand = async (game, message, target, from) => {
	if (target === "nobody") {
		await message.reply(":x: Not shooting anybody.")
		return
	}

	game.addAction("a/fence_gun/shoot", ["instant"], {
		name: "A/Fence-shoot",
		expiry: 1,
		from,
		to: target,
	})

	await message.reply(":alien: You have decided to probe **" + target.getDisplayName() + "** tonight.")
}

shoot.ALLOW_NONSPECIFIC = false
shoot.PRIVATE_ONLY = true
shoot.DEAD_CANNOT_USE = true
shoot.ALIVE_CANNOT_USE = false
shoot.DISALLOW_DAY = false
shoot.DISALLOW_NIGHT = true

export = createTargetCommand(shoot, {
	name: "shoot",
	description: "Shoots a player",
	usage: "shoot <player | nobody>",
})
