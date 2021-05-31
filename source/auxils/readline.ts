import { Client } from "discord.js"
import lineReader from "readline"
import { findCommand } from "../commands/commandFinder"
import { CommandUsageError, ConsoleCommand } from "../commands/CommandType"
import getLogger from "../getLogger"
import { LcnConfig } from "../LcnConfig"

const readline = (client: Client, config: LcnConfig): void => {
	const rl = lineReader.createInterface({
		input: process.stdin,
		output: process.stdout,
	})

	const onReadLine = async (msg: string) => {
		const details = msg.split(" ")
		const given = details[0]

		const command = findCommand(given, null, null, (cmd) => cmd.type === "console")
		if (!command) {
			console.log('Unknown command. Type "help" for help.')
			return
		}
		// Run the command
		try {
			await (command.command as ConsoleCommand)(client, config, details.slice(1))
		} catch (e) {
			if (e instanceof CommandUsageError) {
				const usage = command.usage || config["command-prefix"] + command.name
				console.log(`:x: ${e.message}. Usage: ${usage}`)
			} else {
				const logger = getLogger()
				logger.log(4, "Command execution error.")
				logger.logError(e)
			}
		}
	}

	rl.on("line", (msg) => {
		onReadLine(msg).catch(console.error)
	})
}

export default readline
