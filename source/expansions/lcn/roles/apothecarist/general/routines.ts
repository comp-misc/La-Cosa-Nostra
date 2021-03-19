import auxils from "../../../../../systems/auxils"
import { RoleRoutine } from "../../../../../systems/Role"

const routines: RoleRoutine = (player) => {
	const config = player.getGame().config

	// Nighttime actions
	const channel = player.getPrivateChannel()

	if (player.misc.apothecarist_poisons_left > 0) {
		player
			.getGame()
			.sendPeriodPin(
				channel,
				":herb: You may choose to poison a player tonight.\n\nYou have __" +
					player.misc.apothecarist_poisons_left +
					"__ poison" +
					auxils.vocab("s", player.misc.apothecarist_poisons_left) +
					" left.\n\nUse `" +
					config["command-prefix"] +
					"poison <alphabet/name/nobody>` to select your target."
			)
	} else {
		player.getGame().sendPeriodPin(channel, ":herb: You have run out of poisons.")
	}
}

routines.ALLOW_DEAD = false
routines.ALLOW_NIGHT = true
routines.ALLOW_DAY = false

export = routines
