import { Client } from "discord.js"
import fs from "fs"
import { PathLike } from "node:fs"
import jsonReviver from "../../auxils/jsonReviver"
import botDirectories from "../../BotDirectories"
import { LcnConfig } from "../../LcnConfig"
import { Role } from "../Role"
import getRoles from "../roles"
import Actions from "./Actions"
import Game from "./Game"
import Player from "./Player"
import PlayerRole from "./PlayerRole"
import { SerializedRole } from "./saveGame"
import Timer from "./Timer"

const data_directory = botDirectories.data

const loadRole = (role: SerializedRole, file: PathLike): Role => {
	const roles = getRoles()
	const roleData = Object.values(roles).find(
		(r) => r.identifier === role.identifier && r.expansion === role.expansion
	)
	if (!roleData) {
		throw new Error(
			`Unable to find role '${role.identifier}' from expansion '${role.expansion}' in file ${file.toString()}`
		)
	}
	const result: Role = {
		...roleData,
		role: new roleData.roleClass(role.config),
	}
	return result
}

const loadPlayer = async (file: PathLike, game: Game): Promise<Player> => {
	const playerSave = await loadFileJson(file)

	const playerRole = loadRole(playerSave.role, file)
	//Delete from save to prevent overriding
	delete playerSave.role

	const player = new Player(game, playerSave.id, playerSave.identifier, playerSave.alphabet, playerRole)
	Object.assign(player, playerSave)
	player.previousRoles = (playerSave.previousRoles as SerializedRole[]).map(
		(data) => new PlayerRole(loadRole(data, file), player)
	)
	return player
}

const loadGame = async (client: Client, config: LcnConfig, saveFolder = "game_cache"): Promise<Timer> => {
	// Loads
	const save = await loadFileJson(`${data_directory}/${saveFolder}/game.json`)

	// Save is a game instance
	let game = new Game(client, config)
	game = Object.assign(game, save)

	// Reload all players
	const playerFiles = fs.readdirSync(data_directory + "/" + saveFolder + "/players/")
	for (const playerFile of playerFiles) {
		if (!playerFile.toLowerCase().endsWith(".json")) {
			continue
		}
		game.players.push(await loadPlayer(`${data_directory}/${saveFolder}/players/${playerFile}`, game))
	}

	const actions = new Actions(game)
	game.actions = Object.assign(actions, game.actions)

	// Sort the players array in alphabetical order
	game.players.sort((a, b) => a.alphabet.localeCompare(b.alphabet))

	// Reinstantiate deleted properties
	const timer = new Timer(game)
	await game.reinstantiate(timer)
	await timer.reinstantiate(game)
	return timer
}

const loadFileJson = (file: PathLike): Promise<Record<string, any>> =>
	new Promise((resolve, reject) =>
		fs.readFile(
			file,
			{
				encoding: "utf-8",
			},
			(err, data) => {
				if (err) reject(err)
				else resolve(JSON.parse(data, jsonReviver))
			}
		)
	)

export default loadGame
