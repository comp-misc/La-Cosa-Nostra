import createTargetCommand, { TargetRoleCommand } from "../../../../../commands/createTargetCommand"

const investigate: TargetRoleCommand = async (game, message, target, from) => {
	game.actions.delete((x) => x.from === from.identifier && x.identifier === "gunsmith/investigate")

	if (target === "nobody") {
		await message.reply(":mag: You have decided not to investigate anyone tonight.")
		return
	}

	game.addAction("gunsmith/investigate", ["cycle"], {
		name: "Gunsmith-investigation",
		expiry: 1,
		from,
		to: target,
	})

	await message.reply(":mag: You have decided to investigate **" + target.getDisplayName() + "** tonight.")
}

investigate.ALLOW_NONSPECIFIC = false
investigate.PRIVATE_ONLY = true
investigate.DEAD_CANNOT_USE = true
investigate.ALIVE_CANNOT_USE = false
investigate.DISALLOW_DAY = true
investigate.DISALLOW_NIGHT = false

export default createTargetCommand(investigate, {
	name: "investigate",
	description: "Selects a player to investigate",
})
