import { Guild, GuildChannel, PermissionObject } from "discord.js"
import filterDefined from "../../auxils/filterDefined"
import getGuild from "../../getGuild"
import { GuildChannelType } from "../../GuildChannelType"
import auxils from "../../systems/auxils"
import { AdminCommand } from "../CommandType"

const setPerms = async (guild: Guild, roles: string[], channels: GuildChannel[], perms: PermissionObject) => {
	const validRoles = filterDefined(roles.map((role) => guild.roles.cache.find((x) => x.name == role)))
	await Promise.all(channels.flatMap((channel) => validRoles.map((role) => channel.createOverwrite(role, perms))))
}

const createChannel = async (guild: Guild, name: string, type: GuildChannelType = "text") => {
	const existingChannel = guild.channels.cache.find((ch) => ch.name === name && ch.type === type)
	if (existingChannel) {
		return existingChannel
	}
	return guild.channels.create(name, { type })
}

const _createChannel: AdminCommand = async (message, _, config): Promise<void> => {
	await message.channel.send(":hourglass_flowing_sand: Creating game channels if they do not exist.")

	const guild = getGuild(message.client)

	const permissions = config.permissions
	const base_perms = config["base-perms"]

	const channels_created = await Promise.all(
		Object.entries(config.channels)
			.filter(([key]) => key !== "welcome-channel")
			.map(([, name]) => createChannel(guild, name, "text"))
	)
	const categories_created = await Promise.all(
		Object.values(config.categories).map((name) => createChannel(name, "category"))
	)

	const all_channels = channels_created.concat(categories_created)

	await setPerms(
		guild,
		[
			permissions.admin,
			permissions.alive,
			permissions.dead,
			permissions.spectator,
			permissions.aftermath,
			permissions.pre,
		],
		all_channels,
		base_perms["read"]
	)
	await setPerms(guild, ["@everyone"], all_channels, base_perms["deny"])

	await message.channel.send(
		":ok: Created **" +
			channels_created.length +
			"** text channel" +
			auxils.vocab("s", channels_created.length) +
			" and **" +
			categories_created.length +
			"** category channel" +
			auxils.vocab("s", categories_created.length) +
			"."
	)
}

export = _createChannel
