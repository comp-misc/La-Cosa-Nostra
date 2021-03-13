import auxils from "../../systems/auxils"
import { UnaffiliatedCommand } from "../CommandType"

const uptime: UnaffiliatedCommand = async (message) => {
	await message.channel.send(":clock: Current uptime: **" + auxils.formatDate(process.uptime() * 1000) + "**.")
}

export = uptime
