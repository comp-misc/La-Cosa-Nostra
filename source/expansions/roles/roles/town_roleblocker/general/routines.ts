import { RoleRoutine } from "../../../../../systems/Role"

const routines: RoleRoutine = async (player) => {
	const config = player.getGame().config

	// Nighttime actions
	const channel = player.getPrivateChannel()

	await player
		.getGame()
		.sendPeriodPin(
			channel,
			":no_entry_sign: You may roleblock a player tonight.\n\nUse `" +
				config["command-prefix"] +
				"roleblock <player | nobody>` to select your target."
		)
}

routines.ALLOW_DEAD = false
routines.ALLOW_NIGHT = true
routines.ALLOW_DAY = false

export default routines
