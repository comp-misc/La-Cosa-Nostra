import { Snowflake } from "discord.js"
import getLogger from "../../../getLogger"
import Game from "../../game_templates/Game"

export default async (game: Game, channel_id: Snowflake, message_id: Snowflake): Promise<void> => {
	const channel = game.findTextChannel(channel_id)
	const message = await channel.messages.fetch(message_id)
	if (message) {
		await message.reactions.removeAll()
	} else {
		getLogger().log(0, `Message not found with id ${message_id}, was it deleted?`)
	}
}
