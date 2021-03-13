import { hasTimer, getTimer } from "../../getTimer"
import { AdminCommand } from "../CommandType"

const _stalemate: AdminCommand = async (message) => {
	if (!hasTimer() || !["pre-game", "playing"].includes(getTimer().game.state)) {
		await message.channel.send(":x: No game in progress.")
		return
	}

	const game = getTimer().game

	// Declare stalemate
	game.primeWinLog("stalemate", "Nobody wins.")
	game.postWinLog()
	game.endGame()

	await message.channel.send(":ok: Forced a game stalemate.")
}

export = _stalemate
