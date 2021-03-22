import { PermissionObject, Role, TextChannel } from "discord.js"
import Game from "../../game_templates/Game"

const setPermissions = async (channels: TextChannel[], role: Role, permissions: PermissionObject) =>
	Promise.all(channels.map((channel) => channel.createOverwrite(role, permissions)))

export = async (game: Game): Promise<void> => {
	// Open up simple chats
	const config = game.config
	const guild = game.getGuild()

	// Should only be set once
	const alive = guild.roles.cache.find((x) => x.name === config.permissions.alive)
	if (!alive) {
		throw new Error("No alive role found")
	}

	const main_channel = game.getMainChannel()
	const whisper_channel = game.getWhisperLogChannel()

	const read_perms = config["base-perms"]["read"]

	await setPermissions([main_channel, whisper_channel], alive, read_perms)
}
