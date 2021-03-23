import createTargetCommand, { TargetRoleCommand } from "../../../../../commands/createTargetCommand"

const track: TargetRoleCommand = async (game, message, target, from) => {
	const actions = game.actions

	// Run checks, etc
	actions.delete((x) => x.from === from.identifier && x.identifier === "tracker/track")

	if (target === "nobody") {
		await message.reply(":mag: You have decided not to track anyone tonight.")
		return
	}

	game.addAction("tracker/track", ["cycle"], {
		name: "Tracker-track",
		expiry: 1,
		from,
		to: target,
	})

	await message.reply(":mag: You have decided to track **" + target.getDisplayName() + "** tonight.")
}

track.ALLOW_NONSPECIFIC = false
track.PRIVATE_ONLY = true
track.DEAD_CANNOT_USE = true
track.ALIVE_CANNOT_USE = false
track.DISALLOW_DAY = true
track.DISALLOW_NIGHT = false

export default createTargetCommand(track, {
	name: "track",
	description: "Selects a player to track",
})
