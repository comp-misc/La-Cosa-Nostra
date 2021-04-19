import createTargetCommand, { TargetRoleCommand } from "../../../../../commands/createTargetCommand"

const protect: TargetRoleCommand = async (game, message, target, from) => {
	game.actions.delete((x) => x.from === from.identifier && x.identifier === "town_doctor/protect")
	if (target === "nobody") {
		await message.reply(":shield: You have decided to protect nobody tonight.")
		return
	}

	await game.addAction("town_doctor/protect", ["cycle"], {
		name: "Doc-protect",
		expiry: 1,
		from,
		to: target,
	})
	await message.reply(":shield: You have decided to protect **" + target.getDisplayName() + "** tonight.")
}

protect.ALLOW_NONSPECIFIC = false
protect.PRIVATE_ONLY = true
protect.DEAD_CANNOT_USE = true
protect.ALIVE_CANNOT_USE = false
protect.DISALLOW_DAY = true
protect.DISALLOW_NIGHT = false

export default createTargetCommand(protect, {
	name: "protect",
	description: "Select a player to protect at night",
})
