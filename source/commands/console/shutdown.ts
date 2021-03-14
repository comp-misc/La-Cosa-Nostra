import getLogger from "../../getLogger"
import { ConsoleCommand } from "../CommandType"
import makeCommand from "../makeCommand"

const shutdown: ConsoleCommand = (client) => {
	const logger = getLogger()
	console.log("Shutting down...")
	client.destroy()

	logger.log(2, "Bot shut down")

	console.log("Goodbye")
	process.exit()
}

export default makeCommand(shutdown, {
	name: "shutdown",
	description: "Shuts down the bot",
	aliases: ["stop"],
})
