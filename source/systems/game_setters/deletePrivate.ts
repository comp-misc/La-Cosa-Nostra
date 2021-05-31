import { CategoryChannel, Client } from "discord.js"
import { LcnConfig } from "../../LcnConfig"
import getGuild from "../../getGuild"

export default async (client: Client, config: LcnConfig): Promise<void> => {
	const category = config.categories.private
	const guild = getGuild(client)

	// Bug with discord.js
	const cat_channel = guild.channels.cache.find(
		(x) => x.type === "category" && (x as CategoryChannel).name === category
	) as CategoryChannel

	// Check if category configuration is correct
	if (!cat_channel) {
		throw new Error("Private category is invalid or non-existent!")
	}

	// Delete children of category channel
	// SN: okay "delete children" sounds so wrong
	// but whatever it's "programming"

	const channels = cat_channel.children.array()

	for (let i = 0; i < channels.length; i++) {
		await channels[i].delete()
	}
}
