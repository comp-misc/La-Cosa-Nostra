import clearModuleActions from "../../../../../rolesystem/modular/clearModuleActions"
import createTargetCommand, { TargetRoleCommand } from "../../../../../commands/createTargetCommand"

const track: TargetRoleCommand = async (game, message, target, from) => {
	// Run checks, etc

	clearModuleActions(game, from.identifier, "ability")

	if (target === "nobody") {
		await message.reply(":mag_right: You have decided not to track anyone tonight.")
		return
	}

	game.addAction("a/ability_track/track", ["cycle"], {
		name: "Modular-track",
		expiry: 1,
		from,
		meta: { type: "ability" },
		to: target,
		priority: 9,
	})

	await message.reply(":mag_right: You have decided to track **" + target.getDisplayName() + "** tonight.")
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
