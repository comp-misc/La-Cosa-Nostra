import { PermissionObject, Role, TextChannel, User } from "discord.js"
import Game from "../game_templates/Game"

export interface RolePermission {
	target: Role | User
	permissions: PermissionObject
}

export default async (game: Game, channel_name: string, permissions: RolePermission[]): Promise<TextChannel> => {
	const config = game.config
	const client = game.client

	const guild = game.getGuild()

	const spectator = guild.roles.find((x) => x.name === config["permissions"]["spectator"])
	const admin = guild.roles.find((x) => x.name === config["permissions"]["admin"])

	permissions = [
		{ target: spectator, permissions: config["base-perms"]["read"] },
		{ target: admin, permissions: config["base-perms"]["manage"] },
		...permissions,
	]

	const category = config["categories"]["private"]
	const cat_channel = client.channels.find(
		(x) => x instanceof TextChannel && x.name === category && x.type === "category"
	)

	const channel = (await guild.createChannel(channel_name, {
		type: "text",
		permissionOverwrites: [{ id: guild.id, deny: ["READ_MESSAGES"] }],
		parent: cat_channel,
		position: 0,
	})) as TextChannel

	// {target, permissions}
	for (let i = 0; i < permissions.length; i++) {
		if (!permissions[i].target) {
			continue
		}

		await channel.overwritePermissions(permissions[i].target, permissions[i].permissions)
	}

	game.setChannel(channel_name, channel)

	return channel
}
