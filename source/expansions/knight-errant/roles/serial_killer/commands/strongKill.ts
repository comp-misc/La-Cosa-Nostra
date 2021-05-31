import createTargetCommand, { TargetRoleCommand } from "../../../../../commands/createTargetCommand"
import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"

const strongkill: TargetRoleCommand = async (game, message, target, from) => {
	game.actions.delete(
		(x) =>
			x.from === from.identifier &&
			(x.identifier === "serial_killer/kill" || x.identifier === "serial_killer/strongkill")
	)
	// Run checks, etc
	if (target === "nobody") {
		await message.reply(":no_entry: You have decided not to kill anyone tonight.")
		return
	}

	if (from.misc.strongkills_left < 1) {
		await message.reply(":x: You have run out of strong kills")
		return
	}
	await game.addAction("serial_killer/strongkill", ["cycle"], {
		name: "SK-kill",
		expiry: 1,
		from,
		to: target,
		priority: ActionPriorities.KILL,
	})

	await message.reply(":no_entry: You have decided to strong kill **" + target.getDisplayName() + "** tonight.")
}

strongkill.PRIVATE_ONLY = true
strongkill.DEAD_CANNOT_USE = true
strongkill.ALIVE_CANNOT_USE = false
strongkill.DISALLOW_DAY = true
strongkill.DISALLOW_NIGHT = false

export default createTargetCommand(strongkill, {
	name: "strongkill",
	description: "Selects a player to strong kill",
})
