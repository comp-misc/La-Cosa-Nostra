import { RoleRoutine } from "../../../../../systems/Role"

const routines: RoleRoutine = async (player) => {
	const game = player.getGame()
	const config = game.config

	// Stop initiation
	if (!game.exists((x) => x.misc.mason_channel === player.misc.mason_channel && x.isAlive())) {
		return
	}

	const channel = game.getChannelById(player.misc.mason_channel)
	if (!channel) {
		throw new Error(`No mason channel found`)
	}

	if (player.misc.mason_initiator === true) {
		await channel.send("~~                                              ~~    **" + game.getFormattedDay() + "**")
	}

	const member = player.getGuildMember()

	if (!member) {
		return
	}

	if (game.isDay()) {
		// Day time
		await channel.createOverwrite(member, config["base-perms"].read)
	} else {
		// Night time
		await channel.createOverwrite(member, config["base-perms"].post)
	}
}

routines.ALLOW_DEAD = false
routines.ALLOW_NIGHT = true
routines.ALLOW_DAY = true

export default routines
