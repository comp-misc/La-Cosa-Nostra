import { RoleRoutine } from "../../../../../source/systems/Role"

// Routines
// Runs every cycle

// Function should be synchronous

const routines: RoleRoutine = async (player) => {
	const game = player.getGame()
	const config = game.config

	// Get the lovers channel

	// Stop initiation
	if (!game.exists((x) => x.misc.lover_channel === player.misc.lover_channel && x.isAlive())) {
		return null
	}

	const channel = game.findTextChannel(player.misc.lover_channel)

	if (player.misc.lover_initiator === true) {
		channel.send("~~                                              ~~    **" + game.getFormattedDay() + "**")
	}

	const member = player.getGuildMember()

	if (!member) {
		return null
	}

	if (game.isDay()) {
		// Day time
		channel.overwritePermissions(member, config["base-perms"]["read"])
	} else {
		// Night time
		channel.overwritePermissions(member, config["base-perms"]["post"])
	}
}

routines.ALLOW_DEAD = false
routines.ALLOW_NIGHT = true
routines.ALLOW_DAY = false

export = routines
