import { Client, Guild } from "discord.js"

export = (client: Client): Guild => {
	const serverId = process.env["server-id"]
	if (!serverId) {
		throw new Error("No value specified for 'server-id'")
	}
	const guild = client.guilds.get(serverId)
	if (!guild) {
		throw new Error("Unable to find guild")
	}
	return guild
}
