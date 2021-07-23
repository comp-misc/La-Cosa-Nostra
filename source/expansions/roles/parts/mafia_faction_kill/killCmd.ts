import MafiaFactionKill, { KillActionableMeta } from "."
import createTargetCommand, { TargetRoleCommand } from "../../../../commands/createTargetCommand"
import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import { deselectExistingActions } from "../RemovableAction"

const kill: TargetRoleCommand = async (game, message, target, from) => {
	const role = from.role.getPartOrThrow(MafiaFactionKill)

	game.actions.delete((action) => role.actionMatches(action))

	if (target === "nobody") {
		await message.reply(":dagger: You have decided not to use the factional kill.")
		await from.broadcastTargetMessage(
			`:dagger: **${from.getDisplayName()}** has decided not to kill anyone tonight. No kill will be attempted if no further action is submitted.`
		)
		return
	}

	if (role.config.singleAction) {
		await deselectExistingActions(from, message, role)
	}

	await game.addAction<KillActionableMeta>("mafia_faction_kill/kill", ["cycle"], {
		name: role.config.actionName || "Faction-Kill",
		expiry: 1,
		priority: ActionPriorities.KILL,
		from,
		to: target,
		meta: {
			faction: role.config.faction,
		},
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

export default createTargetCommand(kill, {
	name: "kill",
	description: "Select a player to faction night kill",
})
