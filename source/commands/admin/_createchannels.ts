import { Guild, GuildChannel, GuildChannelType, PermissionObject } from "discord.js"
import auxils from "../../systems/auxils"
import { AdminCommand } from "../CommandType"

const setPerms = async (guild: Guild, roles: string[], channels: GuildChannel[], perms: PermissionObject) => {
	const validRoles = roles.map((role) => guild.roles.find((x) => x.name == role)).filter((role) => !!role)
	await Promise.all(channels.flatMap((channel) => validRoles.map((role) => channel.overwritePermissions(role, perms))))
}

const createChannel = async (guild: Guild, name: string, type: GuildChannelType = "text") => {
	const existingChannel = guild.channels.find((ch) => ch.name === name && ch.type === type)
	if (existingChannel) {
		return existingChannel
	}
	return guild.createChannel(name, type)
}

const _createChannel: AdminCommand = async (message, _, config): Promise<void> => {
	await message.channel.send(":hourglass_flowing_sand: Creating game channels if they do not exist.")

	const guild = message.client.guilds.find((x) => x.id === process.env["server-id"])

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
