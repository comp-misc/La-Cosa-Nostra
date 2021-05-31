import auxils from "../../systems/auxils"
import { UnaffiliatedCommand } from "../CommandType"

const current: UnaffiliatedCommand = async (message) => {
	const current = new Date()

	await message.channel.send(":clock12: Current time is **" + auxils.formatUTCDate(current) + "**.")
}

export default current
