import getLogger from "../../getLogger"
import { AdminCommand } from "../CommandType"

const shutdown: AdminCommand = async (message) => {
	const logger = getLogger()
	await message.channel.send(":computer: Shutting down...")

	message.client.destroy()

	logger.log(2, "Bot shut down")

	process.exit()
}

export = shutdown
