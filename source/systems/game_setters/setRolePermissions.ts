import { Client, GuildChannel, PermissionObject, Role } from "discord.js"
import getGuild from "../../getGuild"
import { LcnConfig } from "../../LcnConfig"

const setPermissions = async (channels: GuildChannel[], role: Role, permissions: PermissionObject) => {
	for (let i = 0; i < channels.length; i++) {
		if (!channels[i]) {
			continue
		}

		await channels[i].overwritePermissions(role, permissions)
	}
}

const setRolePermissions = async (client: Client, config: LcnConfig): Promise<void> => {
	// Open up simple chats
	const guild = getGuild(client)

	// Should only be set once
	const admin = guild.roles.find((x) => x.name === config.permissions.admin)
	const spectator = guild.roles.find((x) => x.name === config.permissions.spectator)
	const alive = guild.roles.find((x) => x.name === config.permissions.alive)
	const dead = guild.roles.find((x) => x.name === config.permissions.dead)
	const pre = guild.roles.find((x) => x.name === config.permissions.pre)
	const post = guild.roles.find((x) => x.name === config.permissions.aftermath)

	const log_channel = guild.channels.find((x) => x.name === config.channels.log)
	const vote_channel = guild.channels.find((x) => x.name === config.channels.voting)
	const main_channel = guild.channels.find((x) => x.name === config.channels.main)
	const whisper_channel = guild.channels.find((x) => x.name === config.channels["whisper-log"])
	const roles_channel = guild.channels.find((x) => x.name === config.channels.roles)

	const all = [log_channel, vote_channel, main_channel, whisper_channel, roles_channel]

	const read_perms = config["base-perms"].read
	const post_perms = config["base-perms"].post
	const manage_perms = config["base-perms"].manage

	await setPermissions(all, admin, manage_perms)
	await setPermissions(all, spectator, read_perms)
	await setPermissions(all, dead, read_perms)
	await setPermissions(all, alive, read_perms)
	await setPermissions(all, pre, read_perms)

	await setPermissions([log_channel, vote_channel, roles_channel], post, read_perms)
	await setPermissions([main_channel, whisper_channel], post, post_perms)
}

export = setRolePermissions
