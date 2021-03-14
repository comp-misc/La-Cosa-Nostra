/*
Set the nickname and the roles here
*/
import { Client } from "discord.js"
import filterDefined from "../../auxils/filterDefined"
import removeRole from "../../auxils/removeRole"
import getGuild from "../../getGuild"
import getLogger from "../../getLogger"
import { LcnConfig } from "../../LcnConfig"
import Player from "../game_templates/Player"

const nicknameAndRole = async (client: Client, config: LcnConfig, roles: Player[]): Promise<void> => {
	const logger = getLogger()
	const guild = getGuild(client)

	const alive_role = guild.roles.cache.find((x) => x.name === config.permissions.alive)
	const pre_role = guild.roles.cache.find((x) => x.name === config.permissions.pre)
	const dead_role = guild.roles.cache.find((x) => x.name === config.permissions.dead)
	const aftermath_role = guild.roles.cache.find((x) => x.name === config.permissions.aftermath)

	for (let i = 0; i < roles.length; i++) {
		const member = guild.members.cache.get(roles[i].id)

		if (!member) {
			continue
		}

		let name = member.displayName

		// Regex remove square brackets
		// Don't forget double escapes!
		name = name.replace(new RegExp("^([[A-z|0-9]{1,2}] )*", "g"), "")

		try {
			await removeRole(member, filterDefined([pre_role, dead_role, aftermath_role]))

			if (alive_role) {
				await member.roles.add(alive_role)
			}
			await member.setNickname("[" + roles[i].alphabet + "] " + name)
		} catch (err) {
			logger.log(
				3,
				"Permissions name error. The owner of the server is playing? Not a big deal. Just remember to nick yourself."
			)
		}
	}
}

export = nicknameAndRole
