import createTargetCommand, { TargetRoleCommand } from "../../../../../commands/createTargetCommand"

const poison: TargetRoleCommand = async (game, message, target, from) => {
	if (target === "nobody") {
		await message.reply(":herb: You have decided not to poison anyone tonight.")
		return
	}
	const actions = game.actions

	if (from.misc.apothecarist_poisons_left < 1) {
		await message.reply(":x: You have run out of poisons!")
		return
	}

	actions.delete((x) => x.from === from.identifier && x.identifier === "apothecarist/poison")

	game.addAction("apothecarist/poison", ["cycle"], {
		name: "Apothecarist-poison",
		expiry: 1,
		from,
		to: target,
	})

	await message.reply(":herb: You have decided to poison **" + target.getDisplayName() + "** tonight.")
}

poison.ALLOW_NONSPECIFIC = false
poison.PRIVATE_ONLY = true
poison.DEAD_CANNOT_USE = true
poison.ALIVE_CANNOT_USE = false
poison.DISALLOW_DAY = true
poison.DISALLOW_NIGHT = false

export = createTargetCommand(poison, {
	name: "poison",
	description: "Poisons a player",
	usage: "poison <player>",
})
