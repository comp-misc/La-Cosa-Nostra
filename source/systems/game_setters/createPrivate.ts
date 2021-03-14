// TODO: rewrite and assign by player instance

import { CategoryChannel, Client, OverwriteData, Permissions, TextChannel } from "discord.js"
import delay from "../../auxils/delay"
import getGuild from "../../getGuild"
import { LcnConfig } from "../../LcnConfig"
import Player from "../game_templates/Player"

const createPrivate = async (client: Client, config: LcnConfig, roles: Player[]): Promise<TextChannel | null> => {
	// Create private channels [A-Z]; mafia chat-log
	const category = config.categories.private
	const guild = getGuild(client)

	let cat_channel = guild.channels.cache.find((x) => x instanceof CategoryChannel && x.name === category)
	if (!cat_channel) {
		cat_channel = await guild.channels.create(category, { type: "category" })
		await delay(5000)
	}

	const createPrivateChannel = async (name: string, assign_permissions_async = false): Promise<TextChannel> => {
		const overwriteData: OverwriteData = { id: guild.id, deny: [Permissions.FLAGS.READ_MESSAGE_HISTORY] }
		const channel = await guild.channels.create(name, {
			type: "text",
			permissionOverwrites: [overwriteData],
			parent: cat_channel,
		})

		const assignPermissionsAsync = async () => {
			const read_perms = config["base-perms"]["read"]
			const manage_perms = config["base-perms"]["manage"]

			if (spectator) await channel.createOverwrite(spectator, read_perms)
			if (admin) await channel.createOverwrite(admin, manage_perms)
			//await channel.createOverwrite(everyone, {READ_MESSAGES: false, SEND_MESSAGES: false});
		}

		if (assign_permissions_async) {
			assignPermissionsAsync()
		} else {
			await assignPermissionsAsync()
		}

		return channel as TextChannel
	}
	const assignChannel = async (role: Player) => {
		const channel = await createPrivateChannel(role.alphabet)
		role.assignChannel(channel)

		return channel
	}

	const spectator = guild.roles.cache.find((x) => x.name === config.permissions.spectator)
	const admin = guild.roles.cache.find((x) => x.name === config.permissions.admin)

	// Create resolvables so channel creation is quicker
	await Promise.all(roles.map((role) => assignChannel(role)))

	// If mafia has rendezvous chat
	let mafia: TextChannel | null
	if (config.game.mafia["has-chat"]) {
		mafia = await createPrivateChannel(config.game.mafia["chat-name"])
	} else {
		mafia = null
	}

	return mafia
}

export = createPrivate
