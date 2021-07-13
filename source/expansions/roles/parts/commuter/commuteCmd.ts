import Commuter from "."
import { CommandUsageError, RoleCommand } from "../../../../commands/CommandType"
import makeCommand from "../../../../commands/makeCommand"
import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import { deselectExistingActions } from "../RemovableAction"

const commute: RoleCommand = async (game, message, params, from) => {
	const already_commuting = game.actions.exists(
		(x) => x.from === from.identifier && x.identifier === "commuter/commute"
	)

	if (params.length === 0) {
		if (already_commuting) {
			await message.reply(":camping: You are currently choosing to commute")
		} else {
			await message.reply(":camping: You are not currently choosing to commute")
		}
		return
	}
	if (params.length !== 1) {
		throw new CommandUsageError()
	}
	const action = params[0].toLowerCase()
	if (action !== "on" && action !== "off") {
		throw new CommandUsageError(`Unknown action '${action}'`)
	}

	if (action === "off") {
		if (!already_commuting) {
			await message.reply(":x: You were already choosing not to commute tonight!")
		} else {
			game.actions.delete((x) => x.from === from.identifier && x.identifier === "commuter/commute")
			await message.reply(":camping: You are no longer commuting")
		}
		return
	}

	const role = from.role.getPartOrThrow(Commuter)
	if (role.config.shots && role.state.shotsTaken >= role.config.shots) {
		await message.reply(":x: No commutes left")
		return
	}

	if (already_commuting) {
		await message.reply(":x: You were already choosing to commute tonight!")
		return
	}

	if (role.config.singleAction) {
		await deselectExistingActions(from, message, role)
	}

	await message.reply(":camping: You have decided to commute tonight.")
	await game.addAction("commuter/commute", ["cycle"], {
		name: "Commuter-commute",
		expiry: 1,
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
	description: "Allows you to commute this night",
	usage: "commute <on | off>",
})
