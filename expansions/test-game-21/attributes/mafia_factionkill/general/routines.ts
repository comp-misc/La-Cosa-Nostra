import { RoleRoutine } from "../../../../../source/systems/Role"

// Routines
// Runs every cycle

// Function should be synchronous

const routines: RoleRoutine = (player) => {
	const config = player.getGame().config

	// Nighttime actions
	const channel = player.getPrivateChannel()

	player
		.getGame()
		.sendPeriodPin(
			channel,
			":no_entry: You may kill a player tonight using the faction kill.\n\nUse `" +
				config["command-prefix"] +
				"kill <alphabet/name/nobody>` to select your target."
		)
}

routines.ALLOW_DEAD = false
routines.ALLOW_NIGHT = true
routines.ALLOW_DAY = false

export = routines
