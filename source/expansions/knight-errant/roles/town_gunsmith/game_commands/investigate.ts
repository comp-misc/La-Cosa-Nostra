import createTargetCommand, { TargetRoleCommand } from "../../../../../commands/createTargetCommand"
import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"

const investigate: TargetRoleCommand = async (game, message, target, from) => {
	game.actions.delete((x) => x.from === from.identifier && x.identifier === "town_gunsmith/investigate")

	if (target === "nobody") {
		await message.reply(":mag: You have decided not to investigate anyone tonight.")
		return
	}

	await game.addAction("town_gunsmith/investigate", ["cycle"], {
		name: "Gunsmith-investigation",
		expiry: 1,
		from,
		to: target,
		priority: ActionPriorities.INVESTIGATE,
	})

	await message.reply(":mag: You have decided to investigate **" + target.getDisplayName() + "** tonight.")
}

investigate.PRIVATE_ONLY = true
investigate.DEAD_CANNOT_USE = true
investigate.ALIVE_CANNOT_USE = false
investigate.DISALLOW_DAY = true
investigate.DISALLOW_NIGHT = false

export default createTargetCommand(investigate, {
	name: "investigate",
	description: "Selects a player to investigate",
})
