import { TargetRoleCommand, createTargetCommand } from "../../../../../commands/createTargetCommand"
import clearModuleActions from "../../../../../rolesystem/modular/clearModuleActions"
import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"

const heal: TargetRoleCommand = async (game, message, target, from) => {
	clearModuleActions(game, from.identifier, "ability")

	if (target === "nobody") {
		await message.reply(":shield: You have decided not to heal anyone tonight.")
		return
	}

	await game.addAction("a/ability_heal/heal", ["cycle"], {
		name: "Modular-heal",
		expiry: 1,
		from,
		to: target,
		meta: { type: "ability" },
		priority: ActionPriorities.DEFAULT,
	})

	await message.reply(":shield: You have decided to heal **" + target.getDisplayName() + "** tonight.")
}

heal.PRIVATE_ONLY = true
heal.DEAD_CANNOT_USE = true
heal.ALIVE_CANNOT_USE = false
heal.DISALLOW_DAY = true
heal.DISALLOW_NIGHT = false

export default createTargetCommand(heal, {
	name: "heal",
	description: "Selects a player to heal",
})
