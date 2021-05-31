import createTargetCommand, { TargetRoleCommand } from "../../../../../commands/createTargetCommand"
import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"

const monitor: TargetRoleCommand = async (game, message, target, from) => {
	game.actions.delete((x) => x.from === from.identifier && x.identifier === "town_motion_detector/monitor")
	if (target === "nobody") {
		await message.reply(":mag_right:  You have now selected to not monitor anyone tonight.")
		return
	}
	await game.addAction("town_motion_detector/monitor", ["cycle"], {
		name: "Tracker-track",
		expiry: 1,
		from,
		to: target,
		priority: ActionPriorities.INVESTIGATE,
	})
	await message.reply(":mag_right:  You have now selected to monitor **" + target.getDisplayName() + "** tonight.")
}

monitor.PRIVATE_ONLY = true
monitor.DEAD_CANNOT_USE = true
monitor.ALIVE_CANNOT_USE = false
monitor.DISALLOW_DAY = true
monitor.DISALLOW_NIGHT = false

export default createTargetCommand(monitor, {
	name: "monitor",
	description: "Select a player to discover whether any night actions were performed on them",
})
