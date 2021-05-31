import { GuildMember, Role } from "discord.js"

const removeRole = async (member: GuildMember, roles: Role[]): Promise<void> => {
	await Promise.all(
		roles.filter((role) => role && member.roles.cache.has(role.id)).map((role) => member.roles.remove(role))
	)
}

export default removeRole
