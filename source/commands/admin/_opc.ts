import { CategoryChannel, GuildChannel, PermissionObject, Role } from "discord.js"
import getGuild from "../../getGuild"
import { AdminCommand } from "../CommandType"

const _opc: AdminCommand = async (message, params, config) => {
	if (params.length < 2 || !["read", "write", "deny", "manage"].includes(params[0].toLowerCase())) {
		await message.channel.send(
			":x: Wrong syntax! Use `" +
				config["command-prefix"] +
				"_opc <read/write/deny/manage> <role name/everyone>` instead!"
		)
		return
	}

	const operator = params[0].toLowerCase()
	const role_name = params.splice(1, Infinity).join(" ")

	const guild = getGuild(message.client)

	let role: Role | undefined
	if (role_name.toLowerCase() === "everyone") {
		role = guild.roles.everyone
	} else {
		role = guild.roles.cache.find((x) => x.name.toLowerCase() === role_name.toLowerCase())
	}

	if (!role) {
		await message.channel.send(":x: Cannot find that role!")
		return
	}

	const category = guild.channels.cache.find((x) => x.name === config.categories.private && x.type === "category")
	if (!category) {
		await message.channel.send(":x: Cannot find the channel!")
		return
	}

	const channels = (category as CategoryChannel).children.filter((x) => x.type === "text").array()

	await message.channel.send(":hourglass_flowing_sand: Assigning, please wait.")

	const setPerms = async (role: Role, channels: GuildChannel[], perms: PermissionObject) => {
		for (let i = 0; i < channels.length; i++) {
			await channels[i].createOverwrite(role, perms)
		}
	}

	switch (operator) {
		case "read":
			// Set read perms
			await setPerms(role, channels, config["base-perms"]["read"])
			break

		case "write":
			await setPerms(role, channels, config["base-perms"]["post"])
			break

		case "deny":
			await setPerms(role, channels, config["base-perms"]["deny"])
			break

		case "manage":
			await setPerms(role, channels, config["base-perms"]["manage"])
	}

	await message.channel.send(":ok: Assigned permissions.")
}

export = _opc
