import createTargetCommand, { TargetCommand, TargetRoleCommand } from "../../../../commands/createTargetCommand"
import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import { deselectExistingActions } from "../RemovableAction"
import MafiaFactionKill from "./"

const createKillCommand = (role: MafiaFactionKill): TargetCommand => {
	const kill: TargetRoleCommand = async (game, message, target, from) => {
		game.actions.delete((action) => action.identifier === "mafia_faction_kill/kill")

		if (target === "nobody") {
			await message.reply(":dagger: You have decided not to use the factional kill.")
			await from.broadcastTargetMessage(
				`:dagger: **${from.getDisplayName()}** has decided not to kill anyone tonight. No kill will be attempted if no further action is submitted.`
			)
			return
		}

		if (role.config.singleAction) {
			await deselectExistingActions(from, message)
		}

		await game.addAction("mafia_faction_kill/kill", ["cycle"], {
			name: "Faction-Kill",
			expiry: 1,
			priority: ActionPriorities.KILL,
			from,
			to: target,
		})

		await message.reply(
			`:dagger: You have decided to use the factional kill on **${target.getDisplayName()}** tonight.`
		)
		await from.broadcastTargetMessage(
			`:dagger: **${from.getDisplayName()}** is using the factional kill on **${target.getDisplayName()}** tonight.`
		)
	}

	kill.PRIVATE_ONLY = true
	kill.DEAD_CANNOT_USE = true
	kill.ALIVE_CANNOT_USE = false
	kill.DISALLOW_DAY = true
	kill.DISALLOW_NIGHT = false

	return createTargetCommand(kill, {
		name: "kill",
		description: "Select a player to faction night kill",
	})
}

export default createKillCommand
