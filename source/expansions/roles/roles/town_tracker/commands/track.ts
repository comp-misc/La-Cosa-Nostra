import createTargetCommand, { TargetRoleCommand } from "../../../../../commands/createTargetCommand"
import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"

const track: TargetRoleCommand = async (game, message, target, from) => {
	const actions = game.actions

	// Run checks, etc
	actions.delete((x) => x.from === from.identifier && x.identifier === "town_tracker/track")

	if (target === "nobody") {
		await message.reply(":mag_right: You have decided not to track anyone tonight.")
		return
	}

	await game.addAction("town_tracker/track", ["cycle"], {
		name: "Tracker-track",
		expiry: 1,
		from,
		to: target,
		priority: ActionPriorities.INVESTIGATE,
	})

	await message.reply(":mag_right: You have decided to track **" + target.getDisplayName() + "** tonight.")
}

track.PRIVATE_ONLY = true
track.DEAD_CANNOT_USE = true
track.ALIVE_CANNOT_USE = false
track.DISALLOW_DAY = true
track.DISALLOW_NIGHT = false

export default createTargetCommand(track, {
	name: "track",
	description: "Selects a player to track",
})
