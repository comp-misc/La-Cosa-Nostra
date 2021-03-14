import getLogger from "../../getLogger"
import Game from "../game_templates/Game"
import Player from "../game_templates/Player"

export = async (game: Game, role: Player): Promise<void> => {
	const config = game.config
	const logger = getLogger()

	role.kill()

	// Remove alive role
	const guild = game.getGuild()

	const alive_role = guild.roles.cache.find((x) => x.name === config.permissions.alive)
	const dead_role = guild.roles.cache.find((x) => x.name === config.permissions.dead)
	if (!alive_role) {
		throw new Error("No alive role found")
	}
	if (!dead_role) {
		throw new Error("No dead role found")
	}

	const member = guild.members.cache.get(role.id)

	if (!member) {
		logger.log(3, "Trying to kill undefined user. Debugging?")
		return
	}

	await member.roles.add(dead_role)
	await member.roles.remove(alive_role)

	// Remove read permissions from all special channels
	const special_channels = role.getSpecialChannels()
	const read_perms = game.config["base-perms"].read

	for (let i = 0; i < special_channels.length; i++) {
		const channel = guild.channels.cache.get(special_channels[i].id)

		if (!channel) {
			logger.log(4, "Removing read perms from undefined channel.")
			continue
		}

		await channel.createOverwrite(member, read_perms)
	}
}
