import filterDefined from "../../../auxils/filterDefined"
import removeRole from "../../../auxils/removeRole"
import Game from "../../game_templates/Game"

const setRoles = async (game: Game): Promise<void> => {
	const config = game.config

	const guild = game.getGuild()

	const alive = guild.roles.cache.find((x) => x.name === config.permissions.alive)
	const dead = guild.roles.cache.find((x) => x.name === config.permissions.dead)
	const pre = guild.roles.cache.find((x) => x.name === config.permissions.pre)
	const post = guild.roles.cache.find((x) => x.name === config.permissions.aftermath)
	if (!post) {
		throw new Error(`No role '${config.permissions.aftermath}'`)
	}

	const players = game.players

	for (let i = 0; i < players.length; i++) {
		const member = players[i].getGuildMember()

		if (!member) {
			continue
		}

		await member.roles.add(post)
		await removeRole(member, filterDefined([alive, dead, pre]))
	}
}

export default setRoles
