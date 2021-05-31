import { Snowflake } from "discord.js"
import Game from "../../game_templates/Game"

export default async (game: Game, channel_id: Snowflake, message_id: Snowflake): Promise<void> => {
	const channel = game.findTextChannel(channel_id)

	const message = await channel.messages.fetch(message_id)

	if (message && message.pinned) {
		// Unpin
		await message.unpin()
	}
}
