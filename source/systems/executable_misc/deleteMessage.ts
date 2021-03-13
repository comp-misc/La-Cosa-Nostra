import { Snowflake } from "discord.js"
import Game from "../game_templates/Game"

export = async (game: Game, channel_id: Snowflake, message_id: Snowflake): Promise<void> => {
	const channel = game.findTextChannel(channel_id)
	const message = await channel.fetchMessage(message_id)

	await message.delete()
}
