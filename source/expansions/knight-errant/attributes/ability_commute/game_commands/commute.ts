import { RoleCommand } from "../../../../../commands/CommandType"
import clearModuleActions from "../../../../../rolesystem/modular/clearModuleActions"
import makeCommand from "../../../../../commands/makeCommand"
import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"

const commute: RoleCommand = async (game, message, params, from) => {
	const actions = game.actions
	const config = game.config

	if (from.misc.commutes_left < 1) {
		await message.reply(":x: No commutes left")
		return
	}

	const already_commuting = actions.exists(
		(x) => x.from === from.identifier && x.identifier === "a/ability_commute/commute"
	)

	if (already_commuting) {
		await message.reply(
			":x: You have already decided to commute tonight! Use `" +
				config["command-prefix"] +
				"deselect` to choose not to commute tonight."
		)
		return
	}

	clearModuleActions(game, from.identifier, "ability")

	await message.reply(":camping: You have decided to commute tonight.")

	await game.addAction("a/ability_commute/commute", ["cycle"], {
		name: "Modular-commute",
		expiry: 1,
		meta: { type: "ability" },
		from,
		to: from,
		priority: ActionPriorities.HIGHEST,
	})
}

commute.PRIVATE_ONLY = true
commute.DEAD_CANNOT_USE = true
commute.ALIVE_CANNOT_USE = false
commute.DISALLOW_DAY = true
commute.DISALLOW_NIGHT = false

export default makeCommand(commute, {
	name: "commute",
	description: "Allows you to commute this night. Use '!deselect' to not commute",
})
