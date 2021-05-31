import { Message } from "discord.js"
import { AdminCommand } from "../CommandType"

const unpin: AdminCommand = async (message, params) => {
	let limit = parseInt(params[0]) || 100
	if (isNaN(limit)) {
		limit = 100
	}

	await message.channel.send(":pushpin: Scanning... this may take a while.")

	let before = message.id

	let arr: Message[] = []

	for (let i = 0; i < limit; i += 100) {
		const messages = await (
			await message.channel.messages.fetch({ limit: Math.min(limit - i, 100), before: before })
		).array()

		arr = [...arr, ...messages]

		if (messages.length < 100) {
			break
		} else {
			before = messages[99].id
		}
	}

	const pinned = arr.filter((m) => m.pinned)

	await message.channel.send(
		`:pushpin: Scanned **${limit}** message(s) and marked **${pinned.length}** message(s) for unpinning.`
	)

	await Promise.all(pinned.map((m) => m.unpin()))
	await message.channel.send(":pushpin: Successfully unpinned the message(s)")
}

export default unpin
