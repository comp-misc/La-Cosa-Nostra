// Main functional
import assignRoles from "./assignRoles"
import createGame from "./createGame"
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
import { getTimer, hasTimer } from "../../getTimer"

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

		delete (process as any).timer
		logger.log(2, "Destroyed previous Timer instance.")
	}

	const new_config = configModifier(config)

	// assign roles first
	const roles = await assignRoles(client, new_config)

	await deletePrivate(client, new_config)

	// Delete (or rename) previous cache
	deleteCaches()

	// Initialise cache
	initCache()

	// Create private channels
	const mafia_channel = await createPrivate(client, new_config, roles)

	await nicknameAndRole(client, new_config, roles)
	await setPermissions(new_config, roles)
	await setRolePermissions(client, new_config)

	const [game, timer] = await createGame(client, new_config, roles, mafia_channel)

	// create test vote
	//game.createVotes("development-chambers");

	timer.save()

	await game.postPrimeLog()

	logger.log(2, "Game Timer instance created.")
	;(process as any).timer = timer

	return timer
}

export default initGame
