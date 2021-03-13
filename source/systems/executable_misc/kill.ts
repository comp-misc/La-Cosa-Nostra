import getLogger from "../../getLogger"
import Game from "../game_templates/Game"
import Player from "../game_templates/Player"

export = async (game: Game, role: Player): Promise<void> => {
	const config = game.config
	const logger = getLogger()

	role.kill()

	// Remove alive role
	const guild = game.getGuild()

	const alive_role = guild.roles.find((x) => x.name === config.permissions.alive)
	const dead_role = guild.roles.find((x) => x.name === config.permissions.dead)

	const member = guild.members.get(role.id)

	if (member === undefined) {
		logger.log(3, "Trying to kill undefined user. Debugging?")
		return
	}

	member.addRole(dead_role)
	member.removeRole(alive_role)

	// Remove read permissions from all special channels
	const special_channels = role.getSpecialChannels()
	const read_perms = game.config["base-perms"]["read"]

	for (let i = 0; i < special_channels.length; i++) {
		const channel = guild.channels.get(special_channels[i].id)

		if (!channel) {
			logger.log(4, "Removing read perms from undefined channel.")
			continue
		}

		await channel.overwritePermissions(member, read_perms)
	}
}
