import { UnaffiliatedCommand } from "../CommandType"

const link: UnaffiliatedCommand = async (message, _, config) => {
	await message.channel.send(config["server-link"] || "No server link configured")
}

export default link
