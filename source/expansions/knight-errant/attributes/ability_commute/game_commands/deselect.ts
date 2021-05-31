// Register heal
import { RoleCommand } from "../../../../../commands/CommandType"
import clearModuleActions from "../../../../../rolesystem/modular/clearModuleActions"
import makeCommand from "../../../../../commands/makeCommand"

const deselect: RoleCommand = async (game, message, params, from) => {
	const actions = game.actions
	const config = game.config

	if (from.misc.commutes_left < 1) {
		await message.reply(":x: No commutes left")
		return
	}

	const already_commuting = actions.exists((x) => x.from === from.identifier && x.identifier === "a/ability/commute")

	if (!already_commuting) {
		await message.reply(
			":x: You have already decided not to commute tonight. Use `" +
				config["command-prefix"] +
				"commute` to choose to commute tonight."
		)
		return
	}

	clearModuleActions(game, from.identifier, "ability")

	await message.reply(":camping: You have decided not to commute tonight.")
}

deselect.PRIVATE_ONLY = true
deselect.DEAD_CANNOT_USE = true
deselect.ALIVE_CANNOT_USE = false
deselect.DISALLOW_DAY = true
deselect.DISALLOW_NIGHT = false

export default makeCommand(deselect, {
	name: "deselect",
	description: "Disables commuting tonight. Use '!commute' to commute",
})
