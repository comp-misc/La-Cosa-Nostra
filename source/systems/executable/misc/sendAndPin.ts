import { Message, TextChannel } from "discord.js"
import pinMessage from "./pinMessage"

const sendAndPin = async (channel: TextChannel, message: string): Promise<Message> => {
	const pinnable = await channel.send(message)

	await pinMessage(pinnable)
	return pinnable
}

export default sendAndPin
