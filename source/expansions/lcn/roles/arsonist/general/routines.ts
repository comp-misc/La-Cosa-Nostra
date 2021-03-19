// Routines
// Runs every cycle

// Function should be synchronous
import { RoleRoutine } from "../../../../../systems/Role"

const routines: RoleRoutine = (player) => {
	const config = player.getGame().config

	// Nighttime actions
	const channel = player.getPrivateChannel()

	player
		.getGame()
		.sendPeriodPin(
			channel,
			":oil: You may choose to douse a player tonight.\n\nUse `" +
				config["command-prefix"] +
				"douse <alphabet/name/nobody>` to select your target.\n\nAlternatively, you may ignite with `" +
				config["command-prefix"] +
				"ignite`."
		)
}

routines.ALLOW_DEAD = false
routines.ALLOW_NIGHT = true
routines.ALLOW_DAY = false

export = routines
