import { Client, GuildChannel, PermissionObject, Role } from "discord.js"
import getGuild from "../../getGuild"
import { LcnConfig } from "../../LcnConfig"

const setPermissions = async (channels: GuildChannel[], role: Role, permissions: PermissionObject) => {
	for (let i = 0; i < channels.length; i++) {
		if (!channels[i]) {
			continue
		}

		await channels[i].createOverwrite(role, permissions)
	}
}

const validChannels = (channels: (GuildChannel | undefined)[]): GuildChannel[] =>
	channels.filter((x) => x !== undefined) as GuildChannel[]

const setRolePermissions = async (client: Client, config: LcnConfig): Promise<void> => {
	// Open up simple chats
	const guild = getGuild(client)

	// Should only be set once
	const admin = guild.roles.cache.find((x) => x.name === config.permissions.admin)
	const spectator = guild.roles.cache.find((x) => x.name === config.permissions.spectator)
	const alive = guild.roles.cache.find((x) => x.name === config.permissions.alive)
	const dead = guild.roles.cache.find((x) => x.name === config.permissions.dead)
	const pre = guild.roles.cache.find((x) => x.name === config.permissions.pre)
	const post = guild.roles.cache.find((x) => x.name === config.permissions.aftermath)

	const log_channel = guild.channels.cache.find((x) => x.name === config.channels.log)
	const vote_channel = guild.channels.cache.find((x) => x.name === config.channels.voting)
	const main_channel = guild.channels.cache.find((x) => x.name === config.channels.main)
	const whisper_channel = guild.channels.cache.find((x) => x.name === config.channels["whisper-log"])
	const roles_channel = guild.channels.cache.find((x) => x.name === config.channels.roles)

	const all = validChannels([log_channel, vote_channel, main_channel, whisper_channel, roles_channel])

	const read_perms = config["base-perms"].read
	const post_perms = config["base-perms"].post
	const manage_perms = config["base-perms"].manage

	if (admin) await setPermissions(all, admin, manage_perms)
	if (spectator) await setPermissions(all, spectator, read_perms)
	if (dead) await setPermissions(all, dead, read_perms)
	if (alive) await setPermissions(all, alive, read_perms)
	if (pre) await setPermissions(all, pre, read_perms)

	if (post) {
		await setPermissions(validChannels([log_channel, vote_channel, roles_channel]), post, read_perms)
		await setPermissions(validChannels([main_channel, whisper_channel]), post, post_perms)
	}
}

export = setRolePermissions
