import { findCommand } from "../commandFinder"
import { Command, CommandProperties, ConsoleCommand } from "../CommandType"

const command: ConsoleCommand = (_client, _config, params) => {
	const allCommands = require("../../systems/commands") as Command[]

	if (params.length > 0) {
		const command = findCommand(allCommands, params[0], (cmd) => cmd.type === "console")
		if (!command) {
			console.log("Unknown command. Type 'help' for a list")
			return
		}
		console.log(`Help for '${command.name}:`)
		console.log(` - Description: ${command.description}`)
		console.log(` - Usage: ${command.usage || command.name} `)
		if (command.aliases && command.aliases.length > 0) {
			console.log(` - Aliases: ${command.aliases.map((a) => `'${a}'`).join(", ")}`)
		}
		return
	}

	// List all readline commands
	const commandNames = allCommands.filter((c) => c.type === "console").map((c) => c.name)
	console.log("Available commands: " + commandNames.join(", "))
}

const help: CommandProperties<ConsoleCommand> = {
	name: "help",
	command,
	description: "Shows help",
	usage: "help [command]",
}

export = help
