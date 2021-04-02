import Discord, { ColorResolvable, GuildChannel } from "discord.js"
import capitaliseFirstLetter from "../../auxils/capitaliseFirstLetter"
import { findCommand, isValidRoleCommandFor } from "../commandFinder"
import { Command, CommandProperties, UnaffiliatedCommand } from "../CommandType"

const getColor = (type: string): ColorResolvable => {
	switch (type) {
		case "game":
			return "PURPLE"
		case "role":
			return "BLUE"
		case "admin":
			return "RED"
		case "unaffiliated":
			return "GREEN"
		default:
			return "DEFAULT"
	}
}

const command: UnaffiliatedCommand = async (message, params, config) => {
	const allCommands = require("../index") as Command[]
	const filteredCommands = allCommands.filter((cmd) => {
		if (cmd.type === "console") {
			return false
		}
		if (!message.member.roles.cache.some((r) => r.name === config.permissions.admin) && cmd.type === "admin") {
			return false
		}
		if (cmd.type === "role" && !isValidRoleCommandFor(cmd, message.member, message.channel as GuildChannel)) {
			return false
		}
		return true
	})

	if (params.length > 0) {
		const command = findCommand(filteredCommands, params[0], message.member, message.channel as GuildChannel)
		if (!command) {
			await message.reply(`:x: Unknown command. Type '${config["command-prefix"]}help' for a list`)
			return
		}
		const embed = new Discord.MessageEmbed()
		embed.setTitle("Help for " + config["command-prefix"] + command.name)
		embed.setDescription(command.description)
		if (command.usage) {
			embed.addField("Usage", config["command-prefix"] + command.usage || config["command-prefix"] + command.name)
		}
		if (command.aliases && command.aliases.length > 0) {
			embed.addField("Aliases", command.aliases.map((a) => `'${a}'`).join(", "))
		}
		embed.setColor(getColor(command.type))
		await message.reply(embed)
		return
	}

	const byType: Record<string, CommandProperties<unknown>[]> = {}
	filteredCommands.forEach((cmd) => {
		if (!byType[cmd.type]) {
			byType[cmd.type] = []
		}
		byType[cmd.type].push(cmd)
	})

	const msg = Object.entries(byType)
		.map(([type, cmds]) => {
			const cmdNames = cmds.map((cmd) => "`" + cmd.name + "`").sort()
			return "`" + type + "` commands: " + cmdNames.join(", ")
		})
		.join("\n\n")

	await message.channel.send(
		"**Saviet Union Mafia Commands Index ** (prefix `" + config["command-prefix"] + "`)\n\n" + msg
	)
}

const help: CommandProperties<UnaffiliatedCommand> = {
	name: "help",
	command,
	description: "Shows help",
	usage: "help [command]",
}

export = help