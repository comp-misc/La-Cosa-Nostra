import { GuildMember, Role } from "discord.js"

const removeRole = async (member: GuildMember, roles: Role[]): Promise<void> => {
	await Promise.all(roles.filter((role) => role && member.roles.has(role.id)).map((role) => member.removeRole(role.id)))
}

export = removeRole
