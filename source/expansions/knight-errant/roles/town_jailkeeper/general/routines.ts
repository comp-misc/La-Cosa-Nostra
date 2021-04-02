import { RoleRoutine } from "../../../../../systems/Role"

// Routines
// Runs every cycle
const routines: RoleRoutine = async (player) => {
	const config = player.getGame().config

	// Nighttime actions
	const channel = player.getPrivateChannel()

	await player
		.getGame()
		.sendPeriodPin(
			channel,
			":raised_back_of_hand: You may jail a player tonight using the faction kill.\n\nUse `" +
				config["command-prefix"] +
				"jail <alphabet/name/nobody>` to select your target."
		)
}

routines.ALLOW_DEAD = false
routines.ALLOW_NIGHT = true
routines.ALLOW_DAY = false

export default routines
