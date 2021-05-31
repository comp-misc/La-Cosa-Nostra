import { GuildMember, Role, Client } from "discord.js"
import filterDefined from "../../auxils/filterDefined"
import getGuild from "../../getGuild"
import { LcnConfig } from "../../LcnConfig"

const removeRole = async (member: GuildMember, roles: Role[]): Promise<GuildMember[]> =>
	Promise.all(
		roles.filter((role) => role && member.roles.cache.has(role.id)).map((role) => member.roles.remove(role.id))
	)

const removeRoles = async (client: Client, config: LcnConfig): Promise<void> => {
	const guild = getGuild(client)

	const members = guild.members.cache.array()

	const alive = guild.roles.cache.find((x) => x.name === config.permissions.alive)
	const dead = guild.roles.cache.find((x) => x.name === config.permissions.dead)
	const spectator = guild.roles.cache.find((x) => x.name === config.permissions.spectator)
	const pre = guild.roles.cache.find((x) => x.name === config.permissions.pre)
	const post = guild.roles.cache.find((x) => x.name === config.permissions.aftermath)
	const backup = guild.roles.cache.find((x) => x.name === config.permissions.backup)

	const roles = filterDefined([alive, dead, spectator, pre, post, backup])

	for (let i = 0; i < members.length; i++) {
		await removeRole(members[i], roles)
	}
}
export default removeRoles
