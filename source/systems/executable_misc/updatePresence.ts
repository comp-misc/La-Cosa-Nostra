import { PresenceData } from "discord.js"
import Game from "../game_templates/Game"

export = async (game: Game, presence: PresenceData): Promise<void> => {
	await game.client.user.setPresence(presence)
}
