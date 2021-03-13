import { PermissionOverwriteOptions, Role, TextChannel } from "discord.js"
import Game from "../game_templates/Game"

const setPermissions = async (channels: TextChannel[], role: Role, permissions: PermissionOverwriteOptions) =>
	Promise.all(channels.map((channel) => channel.overwritePermissions(role, permissions)))

export = async (game: Game): Promise<void> => {
	// Open up simple chats
	const config = game.config
	const guild = game.getGuild()

	// Should only be set once
	const alive = guild.roles.find((x) => x.name === config.permissions.alive)

	const main_channel = game.getMainChannel()
	const whisper_channel = game.getWhisperLogChannel()

	const read_perms = config["base-perms"]["read"]

	await setPermissions([main_channel, whisper_channel], alive, read_perms)
}
