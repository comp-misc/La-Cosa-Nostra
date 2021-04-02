import { Client, TextChannel } from "discord.js"
import { LcnConfig } from "../../LcnConfig"
import expansions from "../../expansions"
import Game from "../game_templates/Game"
import Player from "../game_templates/Player"
import Timer from "../game_templates/Timer"

const createGame = async (
	client: Client,
	config: LcnConfig,
	roles: Player[],
	mafia_channel: TextChannel | null
): Promise<[Game, Timer]> => {
	const game = new Game(client, config, roles)

	// IMPORTANT!
	if (mafia_channel) {
		game.setChannel("mafia", mafia_channel)
	}

	for (let i = expansions.length - 1; i >= 0; i--) {
		const game_prime = expansions[i].scripts.game_prime
		if (game_prime) {
			await game_prime(game)
		}
	}

	const timer = await new Timer(game).init()
	return [game, timer]
}

export default createGame
