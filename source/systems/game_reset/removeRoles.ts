import { GuildMember, Role, Client } from "discord.js"
import getGuild from "../../getGuild"
import { LcnConfig } from "../../LcnConfig"

const removeRole = async (member: GuildMember, roles: Role[]): Promise<GuildMember[]> =>
	Promise.all(roles.filter((role) => role && member.roles.has(role.id)).map((role) => member.removeRole(role.id)))

const removeRoles = async (client: Client, config: LcnConfig): Promise<void> => {
	const guild = getGuild(client)

	const members = guild.members.array()

	const alive = guild.roles.find((x) => x.name === config.permissions.alive)
	const dead = guild.roles.find((x) => x.name === config.permissions.dead)
	const spectator = guild.roles.find((x) => x.name === config.permissions.spectator)
	const pre = guild.roles.find((x) => x.name === config.permissions.pre)
	const post = guild.roles.find((x) => x.name === config.permissions.aftermath)
	const backup = guild.roles.find((x) => x.name === config.permissions.backup)

	for (let i = 0; i < members.length; i++) {
		await removeRole(members[i], [alive, dead, spectator, pre, post, backup])
	}
}
export = removeRoles
