import { RoleRoutine } from "../../../../../systems/Role"

const routines: RoleRoutine = async (player) => {
	const config = player.getGame().config

	// Nighttime actions
	const channel = player.getPrivateChannel()

	await player
		.getGame()
		.sendPeriodPin(
			channel,
			":no_entry_sign: You may roleblock a player tonight instead of using the factional kill.\n\nUse `" +
				config["command-prefix"] +
				"roleblock <alphabet/name/nobody>` to select your target."
		)
}

routines.ALLOW_DEAD = false
routines.ALLOW_NIGHT = true
routines.ALLOW_DAY = false

export default routines
