import readline from "readline"
import { Client } from "discord.js"
import { LcnConfig } from "../LcnConfig"
import { Command, ConsoleCommand } from "../commands/CommandType"
import getLogger from "../getLogger"
import { findCommand } from "../commands/commandFinder"

const rdline = (client: Client, config: LcnConfig, commands: Command[]): void => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	})

	rl.on("line", async (msg) => {
		const details = msg.split(" ")
		const given = details[0]

		const command = findCommand(commands, given, (cmd) => cmd.type === "console")
		if (!command) {
			console.log('Unknown command. Type "help" for help.')
			return
		}
		// Run the command
		try {
			await (command.command as ConsoleCommand)(client, config, details.slice(1))
		} catch (e) {
			const logger = getLogger()
			console.log(e)
			logger.log(4, "Command execution error.")
			logger.logError(e)
		}
	})
}

export = rdline
