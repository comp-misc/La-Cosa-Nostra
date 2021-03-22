import { Client, PresenceData } from "discord.js"

const updatePresence = async (client: Client, presence: PresenceData): Promise<void> => {
	const user = client.user
	if (!user) {
		throw new Error("No user found on client - not logged in yet?")
	}
	await user.setPresence(presence)
}
export = updatePresence
