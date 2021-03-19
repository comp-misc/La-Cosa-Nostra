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
			":mag: You may choose to investigate a player tonight.\n\nUse `" +
				config["command-prefix"] +
				"investigate <alphabet/name/nobody>` to select your target."
		)
}

routines.ALLOW_DEAD = false
routines.ALLOW_NIGHT = true
routines.ALLOW_DAY = false

export = routines
