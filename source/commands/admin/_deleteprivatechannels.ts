import { CategoryChannel } from "discord.js"
import getGuild from "../../getGuild"
import { AdminCommand } from "../CommandType"

const _deleteprivatechannels: AdminCommand = async (message, _, config): Promise<void> => {
	const guild = getGuild(message.client)

	const category = guild.channels.cache.find((x) => x.name === config.categories.private && x.type === "category")
	if (!category) {
		await message.channel.send(":exclamation: No private channels to delete")
		return
	}

	const channels = (category as CategoryChannel).children.filter((x) => x.type === "text").array()

	await message.channel.send(`:hourglass_flowing_sand: Deleting **${channels.length}** private channels.`)

	for (let i = 0; i < channels.length; i++) {
		await channels[i].delete()
	}

	await message.channel.send(":ok: Deletion complete.")
}

export default _deleteprivatechannels
