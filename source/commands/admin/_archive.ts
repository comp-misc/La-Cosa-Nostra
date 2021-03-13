import { Guild, GuildChannel, PermissionObject } from "discord.js"
import { getTimer, hasTimer } from "../../getTimer"
import { AdminCommand } from "../CommandType"

const setPerms = async (guild: Guild, roles: string[], channels: GuildChannel[], perms: PermissionObject) => {
	const validRoles = roles.map((role) => guild.roles.find((x) => x.name == role)).filter((role) => !!role)
	await Promise.all(channels.flatMap((channel) => validRoles.map((role) => channel.overwritePermissions(role, perms))))
}

const _archive: AdminCommand = async (message, params, config) => {
	if (!hasTimer() && ["pre-game", "playing"].includes(getTimer().game.state)) {
		await message.channel.send(":x: You may not archive a game when one is running or primed.")
		return null
	}

	if (params.length < 1) {
		await message.channel.send(":x: Wrong syntax! Use `" + config["command-prefix"] + "_archive <name>` instead!")
		return null
	}

	const permissions = config.permissions
	const base_perms = config["base-perms"]

	await message.channel.send(":hourglass_flowing_sand: Archiving channels.")

	const client = message.client
	const guild = client.guilds.find((x) => x.id === process.env["server-id"])

	const name = params.join(" ")

	const category = await guild.createChannel("Archive " + name, "category")

	const channels = await Promise.all(
		Object.entries(config.channels)
			.filter(([key]) => key !== "welcome-channel")
			.map(([, channel_name]) => guild.channels.find((x) => x.name === channel_name))
			.filter((ch) => !!ch)
			.map((channel) => {
				return (async () => {
					await channel.setName(name + "-" + channel.name)
					await channel.setParent(category)

					return channel
				})()
			})
	)

	const all_channels = Array.from(channels)
	all_channels.push(category)

	await setPerms(
		guild,
		[permissions.admin, permissions.spectator, permissions.aftermath, "@everyone"],
		all_channels,
		base_perms["read"]
	)
	await setPerms(guild, [permissions.alive, permissions.dead, permissions.pre], all_channels, base_perms["deny"])

	await message.channel.send(":ok: Archived **" + channels.length + "** channels.")
}

export = _archive
