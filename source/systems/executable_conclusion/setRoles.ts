import removeRole from "../../auxils/removeRole"
import Game from "../game_templates/Game"

const setRoles = async (game: Game): Promise<void> => {
	const config = game.config

	const guild = game.getGuild()

	const alive = guild.roles.find((x) => x.name === config.permissions.alive)
	const dead = guild.roles.find((x) => x.name === config.permissions.dead)
	const pre = guild.roles.find((x) => x.name === config.permissions.pre)
	const post = guild.roles.find((x) => x.name === config.permissions.aftermath)

	const players = game.players

	for (let i = 0; i < players.length; i++) {
		const member = players[i].getGuildMember()

		if (!member) {
			continue
		}

		await member.addRole(post)
		await removeRole(member, [alive, dead, pre])
	}
}

export = setRoles
