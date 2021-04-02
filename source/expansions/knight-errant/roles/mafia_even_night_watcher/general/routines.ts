import { RoleRoutine } from "../../../../../systems/Role"

const routines: RoleRoutine = async (player) => {
	// Nighttime actions
	const config = player.getGame().config
	const channel = player.getPrivateChannel()

	if (player.getGame().getPeriod() % 4 === 3) {
		await player
			.getGame()
			.sendPeriodPin(
				channel,
				":telescope: You may choose to watch a player tonight instead of using the factional kill.\n\nUse `" +
					config["command-prefix"] +
					"watch <player | nobody>` to select your target."
			)
	} else {
		await player.getGame().sendPeriodPin(channel, ":mag: You may not watch a player tonight.")
	}
}

routines.ALLOW_DEAD = false
routines.ALLOW_NIGHT = true
routines.ALLOW_DAY = false

export default routines
