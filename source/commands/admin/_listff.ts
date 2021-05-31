import { AdminCommand } from "../CommandType"
import { getTimer, hasTimer } from "../../getTimer"
import makeCommand from "../makeCommand"
import Player, { FFStatus } from "../../systems/game_templates/Player"

const formatList = (title: string, players: Player[]): string => {
	let result = `${title} (${players.length})`
	if (players.length > 0) {
		result += ":```"
		players.forEach((player, i) => {
			result += `\n${i + 1}. ${player.getDisplayName()}`
		})
		result += "```"
	}
	return result
}

const listff: AdminCommand = async (message, params, config) => {
	if (!hasTimer() || !["pre-game", "playing"].includes(getTimer().game.state)) {
		await message.channel.send(":x: No game in progress.")
		return
	}

	const game = getTimer().game

	if (!config.game["fast-forwarding"].allow) {
		await message.channel.send(":x:  Fastforwarding is disabled for this game!")
		return
	}

	if (game.isDay()) {
		await message.channel.send(":x:  Fastforwarding is disabled during the day!")
		return
	}

	const alivePlayers = game.players.filter((p) => p.isAlive())
	const ffOn = alivePlayers.filter((player) => player.ffstatus === FFStatus.AUTO || player.ffstatus === FFStatus.ON)
	const ffOff = alivePlayers.filter((player) => player.ffstatus === FFStatus.OFF)

	await message.channel.send(
		formatList("Fast Forwarding -> auto/on", ffOn) +
			"\n" +
			formatList("Fast Forwarding -> off", ffOff) +
			"\n" +
			"Everyone must have selected fast forwarding on for the night to automatically fast forward"
	)
	await game.checkFastForward()
}

export default makeCommand(listff, {
	name: "_listff",
	description: "Shows information about which players are fast forwarding",
	aliases: ["_addreadyplayer"],
})
