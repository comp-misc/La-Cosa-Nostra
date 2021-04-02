import vocab from "../../../../../auxils/vocab"
import { RoleRoutine } from "../../../../../systems/Role"

const routines: RoleRoutine = async (player) => {
	const game = player.getGame()
	const config = game.config

	// Nighttime actions
	const channel = player.getPrivateChannel()

	player.misc.already_not_commuting = false

	if (player.misc.commutes_left > 0) {
		await player
			.getGame()
			.sendPeriodPin(
				channel,
				":camping:  You may commute **" +
					player.misc.commutes_left +
					"** more time" +
					vocab("s", player.misc.commutes_left) +
					".\n\nUse `" +
					config["command-prefix"] +
					"commute` to choose to commute and `" +
					config["command-prefix"] +
					"deselect` to choose not to commute."
			)
	} else {
		await game.sendPeriodPin(channel, ":camping:  You have run out of commutes.")
	}
}

routines.ALLOW_DEAD = false
routines.ALLOW_NIGHT = true
routines.ALLOW_DAY = false

export default routines
