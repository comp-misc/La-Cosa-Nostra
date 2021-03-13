// Routines
// Runs every cycle

import { RoleRoutine } from "../../../systems/Role"

// Function should be synchronous

const routines: RoleRoutine = async (player) => {
	const game = player.getGame()
	const config = game.config

	// Nighttime actions
	const channel = player.getPrivateChannel()

	// TODO: tell Alien who has not been probed yet and is still alive
	const probed = player.misc.alien_kidnappings

	const unprobed = game
		.findAll((x) => x.isAlive() && !probed.includes(x.identifier) && x.identifier !== player.identifier)
		.map((x, index) => index + 1 + ". " + x.getDisplayName())

	await game.sendPeriodPin(
		channel,
		":alien: You may choose to probe a player tonight.\n\nUse `" +
			config["command-prefix"] +
			"probe <alphabet/name/nobody>` to select your target.\n\nThe following players have yet to be probed:\n```fix\n" +
			unprobed.join("\n") +
			"```"
	)
}

routines.ALLOW_DEAD = false
routines.ALLOW_NIGHT = true
routines.ALLOW_DAY = false

export = routines
