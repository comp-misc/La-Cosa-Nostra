import { RoleRoutine } from "../../../../../systems/Role"

const routines: RoleRoutine = async (player) => {
	const config = player.getGame().config

	// Nighttime actions
	const channel = player.getPrivateChannel()

	await player
		.getGame()
		.sendPeriodPin(
			channel,
			":dagger: You may kill a player tonight using the faction kill.\n\nUse `" +
				config["command-prefix"] +
				"kill <player | nobody>` to select your target."
		)
}

routines.ALLOW_DEAD = false
routines.ALLOW_NIGHT = true
routines.ALLOW_DAY = false

export default routines
