import { Message } from "discord.js"
import delay from "../../../auxils/delay"

const pinFunction = (m: Message): boolean => {
	// Remove the system pin message
	return m.type === "PINS_ADD" && m.system && !m.deleted
}

export default async (message: Message): Promise<boolean> => {
	if (!message.pinnable || message.pinned) {
		return false
	}
	try {
		// Create collector
		const collector = message.channel.createMessageCollector(pinFunction, { max: 3, time: 4000 })
		collector.on("collect", (message: Message) => {
			if (message.type === "PINS_ADD" && message.system && !message.delete) {
				message.delete().catch(console.error)
			}
		})

		// Await
		await delay(400)
		await message.pin()

		return true
	} catch (err) {
		return false
	}
}
