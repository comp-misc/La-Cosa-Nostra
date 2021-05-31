import createTargetCommand, { TargetRoleCommand } from "../../../../../commands/createTargetCommand"
import clearModuleActions from "../../../../../rolesystem/modular/clearModuleActions"
import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"

const roleblock: TargetRoleCommand = async (game, message, target, from) => {
	clearModuleActions(game, from.identifier, "ability")

	if (target === "nobody") {
		await message.reply(":no_entry_sign: You have decided not to roleblock anyone tonight.")
		return
	}

	await game.addAction("a/ability_roleblock/roleblock", ["cycle"], {
		name: "Modular-roleblock",
		expiry: 1,
		from,
		meta: { type: "ability" },
		to: target,
		priority: ActionPriorities.ROLEBLOCK,
	})

	await message.reply(":no_entry_sign: You have decided to roleblock **" + target.getDisplayName() + "** tonight.")
}

roleblock.PRIVATE_ONLY = true
roleblock.DEAD_CANNOT_USE = true
roleblock.ALIVE_CANNOT_USE = false
roleblock.DISALLOW_DAY = true
roleblock.DISALLOW_NIGHT = false

export default createTargetCommand(roleblock, {
	name: "roleblock",
	description: "Select a player to roleblock",
})
