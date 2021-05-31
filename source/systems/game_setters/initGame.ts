// Main functional
import createPlayers from "./createPlayers"
import initCache from "./initCache"
import createPrivate from "./createPrivate"
import deletePrivate from "./deletePrivate"
import setPermissions from "./setPermissions"
import nicknameAndRole from "./nicknameAndRole"
import deleteCaches from "./deleteCaches"
import setRolePermissions from "./setRolePermissions"
import configModifier from "./configModifier"
import { Client } from "discord.js"
import { LcnConfig } from "../../LcnConfig"
import Timer from "../game_templates/Timer"
import getLogger from "../../getLogger"
import { getTimer, hasTimer, removeTimer, setTimer } from "../../getTimer"
import Game from "../game_templates/Game"
import expansions from "../../expansions"

export class GameStartError extends Error {
	constructor(message: string) {
		super(message)
	}
}

const initGame = async (client: Client, config: LcnConfig): Promise<Timer> => {
	const logger = getLogger()
	const user = client.user
	if (!user) {
		throw new Error(`User not logged in`)
	}
	await user.setPresence({
		status: "dnd",
		activity: { name: "setting up...", type: "PLAYING" },
	})

	// Destroy previous timer
	if (hasTimer()) {
		getTimer().destroy()
		removeTimer()
		logger.log(2, "Destroyed previous Timer instance.")
	}

	const newConfig = configModifier(config)

	const game = new Game(client, newConfig)

	// assign roles first
	const players = createPlayers(game, newConfig)
	game.setPlayers(players)

	await deletePrivate(client, newConfig)

	// Delete (or rename) previous cache
	deleteCaches()

	// Initialise cache
	initCache()

	// Create private channels
	const mafia_channel = await createPrivate(client, newConfig, players)

	if (mafia_channel) {
		game.setChannel("mafia", mafia_channel)
	}

	await nicknameAndRole(client, newConfig, players)
	await setPermissions(newConfig, players)
	await setRolePermissions(client, newConfig)

	for (const gameInit of expansions.map((expansion) => expansion.scripts.game_init)) {
		if (gameInit) {
			await gameInit(game)
		}
	}

	const timer = new Timer(game)
	await timer.init()

	await timer.game.save()

	await game.postPrimeLog()

	logger.log(2, "Game Timer instance created.")
	setTimer(timer)

	return timer
}

export default initGame
