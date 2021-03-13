import { Message, TextChannel } from "discord.js"
import pinMessage from "./pinMessage"

export = async (channel: TextChannel, message: Message): Promise<Message> => {
	const pinnable = await channel.send(message)

	await pinMessage(pinnable)

	return pinnable
}
