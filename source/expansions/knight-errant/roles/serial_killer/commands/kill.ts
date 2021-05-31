import createTargetCommand, { TargetRoleCommand } from "../../../../../commands/createTargetCommand"
import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"

const kill: TargetRoleCommand = async (game, message, target, from) => {
	const actions = game.actions

	// Run checks, etc

	actions.delete(
		(x) =>
			x.from === from.identifier &&
			(x.identifier === "serial_killer/kill" || x.identifier === "serial_killer/strongkill")
	)

	if (target === "nobody") {
		await message.reply(":no_entry: You have decided not to kill anyone tonight.")
		return
	}

	await game.addAction("serial_killer/kill", ["cycle"], {
		name: "SK-kill",
		expiry: 1,
		from,
		to: target,
		priority: ActionPriorities.KILL,
	})

	await message.reply(":no_entry: You have decided to kill **" + target.getDisplayName() + "** tonight.")
}

kill.PRIVATE_ONLY = true
kill.DEAD_CANNOT_USE = true
kill.ALIVE_CANNOT_USE = false
kill.DISALLOW_DAY = true
kill.DISALLOW_NIGHT = false

export default createTargetCommand(kill, {
	name: "kill",
	description: "Selects a player to night kill",
})
