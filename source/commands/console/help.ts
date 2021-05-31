import getCommands from ".."
import { findCommand } from "../commandFinder"
import { ConsoleCommand } from "../CommandType"
import makeCommand from "../makeCommand"

const command: ConsoleCommand = (_client, _config, params) => {
	const allCommands = getCommands()

	if (params.length > 0) {
		const command = findCommand(params[0], null, null, (cmd) => cmd.type === "console")
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

export default makeCommand(command, {
	name: "help",
	description: "Shows help",
	usage: "help [command]",
})
