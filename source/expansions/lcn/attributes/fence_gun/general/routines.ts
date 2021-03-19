// Routines
// Runs every cycle

import { RoleRoutine } from "../../../../../systems/Role"

// Function should be synchronous

const routines: RoleRoutine = (player) => {
	const config = player.getGame().config

	// Nighttime actions
	const channel = player.getPrivateChannel()

	player
		.getGame()
		.sendPeriodPin(
			channel,
			":gun: You may choose to shoot one player today.\n\nUse `" +
				config["command-prefix"] +
				"shoot <alphabet/name/nobody>` to select your target.\n\nThis action is irreversible.\n\nShooting a target with their votes cast will lock their votes in place.\n\nThe gun will expire if unused today."
		)
}

routines.ALLOW_DEAD = false
routines.ALLOW_NIGHT = false
routines.ALLOW_DAY = true

export = routines
