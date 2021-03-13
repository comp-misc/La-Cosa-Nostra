import { UnaffiliatedCommand } from "../CommandType"

const heartbeat: UnaffiliatedCommand = async (message) => {
	await message.channel.send(":heart: Heartbeat pong! (" + message.client.ping + " ms)")
}

export = heartbeat
