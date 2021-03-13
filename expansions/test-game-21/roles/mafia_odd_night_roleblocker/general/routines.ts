// Routines
// Runs every cycle

import { RoleRoutine } from "../../../../../source/systems/Role"

// Function should be synchronous

const routines: RoleRoutine = (player) => {
	// Nighttime actions
	const channel = player.getPrivateChannel()
	const game = player.getGame()

	if (game.getPeriod() % 4 === 1) {
		game.sendPeriodPin(
			channel,
			":no_entry_sign:  You may roleblock a player tonight instead of using the factional kill.\n\nUse `" +
				game.config["command-prefix"] +
				"roleblock <alphabet/name/nobody>` to select your target."
		)
	} else {
		game.sendPeriodPin(channel, ":no_entry_sign:  You may not roleblock a player tonight.")
	}
}

routines.ALLOW_DEAD = false
routines.ALLOW_NIGHT = true
routines.ALLOW_DAY = false

export = routines
