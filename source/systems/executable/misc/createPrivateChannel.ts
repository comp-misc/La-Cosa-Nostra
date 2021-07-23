import { CategoryChannel, GuildMember, PermissionObject, Permissions, Role, TextChannel, User } from "discord.js"
import Game from "../../game_templates/Game"

export interface RolePermission {
	target: Role | User | GuildMember
	permissions: PermissionObject
}

export default async (
	game: Game,
	channel_name: string,
	permissions: RolePermission[],
	reason?: string
): Promise<TextChannel> => {
	const config = game.config
	const guild = game.getGuild()

	const spectator = guild.roles.cache.find((x) => x.name === config.permissions.spectator)
	const admin = guild.roles.cache.find((x) => x.name === config.permissions.admin)

	if (spectator) {
		permissions.unshift({ target: spectator, permissions: config["base-perms"].read })
	}
	if (admin) {
		permissions.unshift({ target: admin, permissions: config["base-perms"].manage })
	}

	const category = config.categories.private
	const cat_channel = guild.channels.cache.find((x) => x instanceof CategoryChannel && x.name === category)

	if (!cat_channel) {
		throw new Error(`Unable to find category channel '${category}'`)
	}

	const channel = await guild.channels.create(channel_name, {
		type: "text",
		permissionOverwrites: [
			{ id: guild.id, deny: [Permissions.FLAGS.READ_MESSAGE_HISTORY, Permissions.FLAGS.VIEW_CHANNEL] },
		],
		parent: cat_channel,
		position: 0,
		reason,
	})

	// {target, permissions}
	for (let i = 0; i < permissions.length; i++) {
		if (!permissions[i].target) {
			continue
		}

		await channel.createOverwrite(permissions[i].target, permissions[i].permissions)
	}

	game.setChannel(channel_name, channel)

	return channel
}
