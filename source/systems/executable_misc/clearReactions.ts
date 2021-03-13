import { Snowflake } from "discord.js"
import getLogger from "../../getLogger"
import Game from "../game_templates/Game"

export = async (game: Game, channel_id: Snowflake, message_id: Snowflake): Promise<void> => {
	const channel = game.findTextChannel(channel_id)
	const message = await channel.fetchMessage(message_id)
	if (message) {
		await message.clearReactions()
	} else {
		getLogger().log(0, `Message not found with id ${message_id}, was it deleted?`)
	}
}
