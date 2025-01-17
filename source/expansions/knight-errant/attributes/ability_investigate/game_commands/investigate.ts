import createTargetCommand, { TargetRoleCommand } from "../../../../../commands/createTargetCommand"
import clearModuleActions from "../../../../../rolesystem/modular/clearModuleActions"
import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"

const investigate: TargetRoleCommand = async (game, message, target, from) => {
	clearModuleActions(game, from.identifier, "ability")

	if (target === "nobody") {
		await message.reply(":mag_right: You have decided not to investigate anyone tonight.")
		return
	}

	await game.addAction("a/ability_investigate/investigate", ["cycle"], {
		name: "Modular-investigate",
		expiry: 1,
		from,
		to: target,
		meta: { type: "ability" },
		priority: ActionPriorities.INVESTIGATE,
	})

	await message.reply(":mag_right: You have decided to investigate **" + target.getDisplayName() + "** tonight.")
}

investigate.PRIVATE_ONLY = true
investigate.DEAD_CANNOT_USE = true
investigate.ALIVE_CANNOT_USE = false
investigate.DISALLOW_DAY = true
investigate.DISALLOW_NIGHT = false

export default createTargetCommand(investigate, {
	name: "investigate",
	description: "Investigate a player and find out their alignment",
})
