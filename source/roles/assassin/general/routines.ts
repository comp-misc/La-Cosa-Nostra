// Routines
// Runs every cycle

import { RoleRoutine } from "../../../systems/Role"

// Function should be synchronous

const routines: RoleRoutine = (player) => {
	const config = player.getGame().config

	// Nighttime actions
	const channel = player.getPrivateChannel()

	if (player.misc.assassin_picked_target === false) {
		player
			.getGame()
			.sendPeriodPin(
				channel,
				":dagger: You may choose a victim tonight.\n\nUse `" +
					config["command-prefix"] +
					"pick <alphabet/name/nobody>` to select your target."
			)
	} else {
		const target = player.getGame().getPlayerByIdentifierOrThrow(player.misc.assassin_target)
		player.getGame().sendPeriodPin(channel, ":dagger: Your current target is **" + target.getDisplayName() + "**.")
	}
}

routines.ALLOW_DEAD = false
routines.ALLOW_NIGHT = true
routines.ALLOW_DAY = false

export = routines
