import createTargetCommand, { TargetRoleCommand } from "../../../../../commands/createTargetCommand"

const roleblock: TargetRoleCommand = async (game, message, target, from) => {
	const actions = game.actions

	actions.delete((x) => x.from === from.identifier && x.identifier === "town_roleblocker/roleblock")

	if (target === "nobody") {
		await message.reply(":no_entry_sign: You have decided not to roleblock anyone tonight.")
		return
	}

	game.addAction("town_roleblocker/roleblock", ["cycle"], {
		name: "Roleblocker-roleblock",
		expiry: 1,
		from,
		to: target,
	})

	await message.reply(":no_entry_sign: You have decided to roleblock **" + target.getDisplayName() + "** tonight.")
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
