import createTargetCommand, { TargetRoleCommand } from "../../../../../commands/createTargetCommand"
import clearModuleActions from "../../../../../rolesystem/modular/clearModuleActions"
import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"

const jail: TargetRoleCommand = async (game, message, target, from) => {
	clearModuleActions(game, from.identifier, "ability")

	if (target === "nobody") {
		await message.reply(":european_castle: You have decided not to jail anyone tonight.")
		return
	}

	await game.addAction("a/ability_jail/jail", ["cycle"], {
		name: "Modular-jail",
		expiry: 1,
		from,
		meta: { type: "ability" },
		to: target,
		priority: ActionPriorities.HIGHEST,
	})

	await message.reply(":european_castle: You have decided to jail **" + target.getDisplayName() + "** tonight.")
}

jail.PRIVATE_ONLY = true
jail.DEAD_CANNOT_USE = true
jail.ALIVE_CANNOT_USE = false
jail.DISALLOW_DAY = true
jail.DISALLOW_NIGHT = false

export default createTargetCommand(jail, {
	name: "jail",
	description: "Select a player to jail",
})
