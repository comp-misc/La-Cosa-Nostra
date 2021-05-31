import fs from "fs"
import Game from "./Game"
import PlayerRole from "./PlayerRole"
import botDirectories from "../../BotDirectories"
import Player from "./Player"
import jsonInfinityCensor from "../../auxils/jsonInfinityCensor"
import getLogger from "../../getLogger"
import { PathLike } from "node:fs"

const data_directory = botDirectories.data

export interface SerializedRole {
	identifier: string
	expansion: string
	config: unknown
}

const serializePlayer = (player: Player): Record<string, any> => {
	// Duplication regardless
	// For future use if required
	const playerSerialized: Record<string, any> = Object.assign({}, player)

	// Guess what, I needed it after all
	delete playerSerialized.game
	delete playerSerialized.client

	playerSerialized.role = serializeRole(player.role)
	playerSerialized.previousRoles = player.previousRoles.map(serializeRole)

	return playerSerialized
}

const saveGame = async (game: Game, saveName = "game_cache"): Promise<void> => {
	if (!fs.existsSync(data_directory + "/" + saveName)) {
		fs.mkdirSync(data_directory + "/" + saveName)
	}
	if (!fs.existsSync(data_directory + "/" + saveName + "/players")) {
		fs.mkdirSync(data_directory + "/" + saveName + "/players")
	}
	// Save all components

	// Clone Game instance to savable
	const savable: Record<string, any> = Object.assign({}, game)

	/* This one line of code below here \/ cost me TWO hours of my life
Honestly if only Object.assign() would clone an object in its whole
and not do a half-***ed job I would be a happier person.
*/
	savable.actions = Object.assign({}, game.actions)

	const players = savable.players as Player[]

	// Remove non-serialisable components
	delete savable.client
	delete savable.config
	delete savable.timer
	delete savable.trial_collectors
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	delete savable.actions.game

	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	delete savable.actions.game

	delete savable.players

	savable.last_save_date = new Date()

	await writeFileJson(`${data_directory}/${saveName}/game.json`, savable)

	for (const player of players) {
		await writeFileJson(`${data_directory}/${saveName}/players/${player.alphabet}.json`, serializePlayer(player))
	}
	getLogger().log(1, "Saved game.")
}

const writeFileJson = <T>(file: PathLike, data: T): Promise<void> =>
	new Promise((resolve, reject) =>
		fs.writeFile(file, JSON.stringify(data, jsonInfinityCensor, 2), (err) => {
			if (err) reject(err)
			else resolve()
		})
	)

const serializeRole = (role: PlayerRole): SerializedRole => ({
	identifier: role.identifier,
	expansion: role.expansion,
	config: role.role.config,
})

export default saveGame
