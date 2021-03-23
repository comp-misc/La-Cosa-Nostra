import createTargetCommand, { TargetRoleCommand } from "../../../../../commands/createTargetCommand"

const roleblock: TargetRoleCommand = async (game, message, target, from) => {
	const actions = game.actions

	actions.delete(
		(x) =>
			x.from === from.identifier && (x.tags.includes("mafia_factional_side") || x.tags.includes("mafia_factional_main"))
	)

	if (target === "nobody") {
		await message.reply(":no_entry_sign: You have decided not to roleblock anyone tonight.")
		await game
			.getChannel("mafia")
			.send(":exclamation: **" + from.getDisplayName() + "** is not roleblocking anyone tonight.")
		return null
	}

	game.addAction("mafia_roleblocker/roleblock", ["cycle"], {
		name: "Mafia-roleblocker-roleblock",
		expiry: 1,
		from,
		to: target,
		tags: ["mafia_factional_side"],
	})

	const mention = target.getDisplayName()

	await message.reply(":no_entry_sign: You have decided to roleblock **" + mention + "** tonight.")
	await game
		.getChannel("mafia")
		.send(":exclamation: **" + from.getDisplayName() + "** is roleblocking **" + mention + "** tonight.")
}

roleblock.ALLOW_NONSPECIFIC = false
roleblock.PRIVATE_ONLY = true
roleblock.DEAD_CANNOT_USE = true
roleblock.ALIVE_CANNOT_USE = false
roleblock.DISALLOW_DAY = true
roleblock.DISALLOW_NIGHT = false

export default createTargetCommand(roleblock, {
	name: "roleblock",
	description: "Selects a player to roleblock",
})
