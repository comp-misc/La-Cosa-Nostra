// TODO: rewrite and assign by player instance

import { CategoryChannel, Client, TextChannel } from "discord.js"
import delay from "../../auxils/delay"
import getGuild from "../../getGuild"
import { LcnConfig } from "../../LcnConfig"
import Player from "../game_templates/Player"

const createPrivate = async (client: Client, config: LcnConfig, roles: Player[]): Promise<TextChannel | null> => {
	// Create private channels [A-Z]; mafia chat-log
	const category = config.categories.private

	// Bug with discord.js
	const cat_channel = client.channels.find(
		(x) => x.type === "category" && (x as CategoryChannel).name === category
	) as CategoryChannel

	// Check if category configuration is correct
	if (!cat_channel) {
		const err = "Private category is invalid or non-existent!"
		throw new Error(err)
	}

	const createPrivateChannel = async (name: string, assign_permissions_async = false): Promise<TextChannel> => {
		const channel = await guild.createChannel(name, {
			type: "text",
			permissionOverwrites: [{ id: guild.id, deny: ["READ_MESSAGES"] }],
			parent: cat_channel,
		})

		const assignPermissionsAsync = async () => {
			const read_perms = config["base-perms"]["read"]
			const manage_perms = config["base-perms"]["manage"]

			//await channel.overwritePermissions(everyone, {READ_MESSAGES: false, SEND_MESSAGES: false});
			await channel.overwritePermissions(spectator, read_perms)
			await channel.overwritePermissions(admin, manage_perms)
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

	const spectator = cat_channel.guild.roles.find((x) => x.name === config.permissions.spectator)
	const admin = cat_channel.guild.roles.find((x) => x.name === config.permissions.admin)

	const guild = getGuild(client)

	// Create resolvables so channel creation is quicker
	const resolvables = []

	// Create A-Z chats
	for (let i = 0; i < roles.length; i++) {
		resolvables.push(assignChannel(roles[i]))

		// Short hiatus to prevent ENOTFOUND connection error
		// Critical, apparently
		await delay(500)
	}

	// If mafia has rendezvous chat
	let mafia: TextChannel | null
	if (config["game"]["mafia"]["has-chat"]) {
		mafia = await createPrivateChannel(config["game"]["mafia"]["chat-name"])
	} else {
		mafia = null
	}
	await Promise.all(resolvables)
	return mafia
}

export = createPrivate
