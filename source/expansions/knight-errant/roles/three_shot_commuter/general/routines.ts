import vocab from "../../../../../auxils/vocab"
import { RoleRoutine } from "../../../../../systems/Role"

const routines: RoleRoutine = async (player) => {
	const config = player.getGame().config

	// Nighttime actions
	const channel = player.getPrivateChannel()

	if (player.misc.commutes_left < 1) {
		return null
	}

	await player
		.getGame()
		.sendPeriodPin(
			channel,
			":runner: You may commute **" +
				player.misc.commutes_left +
				"** more time" +
				vocab("s", player.misc.commutes_left) +
				".\n\nUse `" +
				config["command-prefix"] +
				"commute` to choose to commute and `" +
				config["command-prefix"] +
				"deselect` to choose not to commute."
		)
}

routines.ALLOW_DEAD = false
routines.ALLOW_NIGHT = true
routines.ALLOW_DAY = false

export default routines
