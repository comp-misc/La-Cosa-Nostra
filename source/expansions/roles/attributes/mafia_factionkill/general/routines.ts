import { RoleRoutine } from "../../../../../systems/Role"
import killCmd from "../game_commands/kill"

const routines: RoleRoutine = async (player) => {
	const config = player.getGame().config

	// Nighttime actions
	const channel = player.getPrivateChannel()

	await player
		.getGame()
		.sendPeriodPin(
			channel,
			":dagger: You may kill a player tonight using the faction kill.\n\n" +
				killCmd.formatUsageDescription(config)
		)
}

routines.ALLOW_DEAD = false
routines.ALLOW_NIGHT = true
routines.ALLOW_DAY = false

export default routines
