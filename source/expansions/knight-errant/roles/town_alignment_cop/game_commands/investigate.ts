import createTargetCommand, { TargetRoleCommand } from "../../../../../commands/createTargetCommand"

const investigate: TargetRoleCommand = async (game, message, target, from) => {
	game.actions.delete((x) => x.from === from.identifier && x.identifier === "town_alignment_cop/investigate")
	if (target === "nobody") {
		await message.reply(":mag_right: You have decided not to investigate anyone tonight.")
		return
	}

	await game.addAction("cop/investigate", ["cycle"], {
		name: "Cop-investigation",
		expiry: 1,
		from,
		to: target,
	})
	await message.reply(":mag_right: You have decided to investigate **" + target.getDisplayName() + "** tonight.")
}

investigate.ALLOW_NONSPECIFIC = false
investigate.PRIVATE_ONLY = true
investigate.DEAD_CANNOT_USE = true
investigate.ALIVE_CANNOT_USE = false
investigate.DISALLOW_DAY = true
investigate.DISALLOW_NIGHT = false

export default createTargetCommand(investigate, {
	name: "investigate",
	description: "Investigate a player and find out their alignment",
})
