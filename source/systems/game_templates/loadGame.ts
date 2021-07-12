import { Client } from "discord.js"
import fs from "fs"
import { PathLike } from "node:fs"
import jsonReviver from "../../auxils/jsonReviver"
import botDirectories from "../../BotDirectories"
import getLogger from "../../getLogger"
import { LcnConfig } from "../../LcnConfig"
import { LoadedRoleMetadata, RoleInfo } from "../../role"
import getRoles from "../roles"
import Actions from "./Actions"
import Game from "./Game"
import Player from "./Player"
import { SerializedRole, SerializedRolePart } from "./saveGame"
import Timer from "./Timer"

const data_directory = botDirectories.data

const getId = (part: SerializedRolePart): string => part.expansion + "/" + part.identifier

const loadRolePartMetadata = (part: SerializedRolePart): LoadedRoleMetadata => {
	const metadata = getRoles()[getId(part)]
	if (!metadata) {
		throw new Error(`No role loaded with id '${getId(part)}'`)
	}
	return metadata
}

const loadRole = (role: SerializedRole): RoleInfo => {
	const main = loadRolePartMetadata(role.main)
	if (main.type !== "complete" && main.type !== "legacy") {
		throw new Error(`Invalid main role '${getId(role.main)}`)
	}
	return {
		mainRole: {
			role: new main.constructor(role.main.config, role.main.state),
			...main,
		},
		parts: role.parts.map((part) => {
			const metadata = loadRolePartMetadata(part)
			return {
				role: new metadata.constructor(part.config, part.state),
				...metadata,
			}
		}),
	}
}

const loadPlayer = async (file: PathLike, game: Game): Promise<Player> => {
	const playerSave = await loadFileJson(file)

	const playerRole = loadRole(playerSave.role)
	//Delete from save to prevent overriding
	delete playerSave.role

	const player = new Player(game, playerSave.id, playerSave.identifier, playerSave.alphabet, playerRole)
	Object.assign(player, playerSave)
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
		try {
			game.players.push(await loadPlayer(`${data_directory}/${saveFolder}/players/${playerFile}`, game))
		} catch (e) {
			getLogger().log(4, "Failed to player file '" + playerFile + "': ")
			throw e
		}
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
