import { UnaffiliatedCommand } from "../CommandType"

const ping: UnaffiliatedCommand = async (message) => {
	const timestamp = new Date(message.createdTimestamp)
	const now = new Date()

	const delta = now.getTime() - timestamp.getTime()

	message.channel.send(":ping_pong: Pong! (" + delta + " ms)")
}

export = ping
