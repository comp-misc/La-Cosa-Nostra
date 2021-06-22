import { Message } from "discord.js"
import CrimeSceneInvestigator from ".."
import cryptographicShuffle from "../../../../../auxils/cryptographicShuffle"
import { CommandUsageError, RoleCommand } from "../../../../../commands/CommandType"
import makeCommand from "../../../../../commands/makeCommand"
import Game from "../../../../../systems/game_templates/Game"
import Player from "../../../../../systems/game_templates/Player"

const handleInvestigate = async (game: Game, message: Message, player: Player, visitor: Player) => {
	const alivePlayers = game.getAlivePlayers().filter((p) => p.identifier !== player.identifier)
	const possiblePlayers = alivePlayers.filter(
		(p) => p.identifier !== visitor.identifier && p.identifier !== player.identifier
	)

	const suspects = [visitor]
	for (let i = 0; i < possiblePlayers.length && i < 2; i++) {
		const index = Math.floor(Math.random() * possiblePlayers.length)
		suspects.push(...possiblePlayers.splice(index, 1))
	}
	const role = player.role.role as CrimeSceneInvestigator
	role.revealSuspects(player, cryptographicShuffle(suspects))

	await message.reply(":mag_right: You have started your investigations. You will receive a report tonight")
}

const investigate: RoleCommand = async (game, message, params, player) => {
	const role = player.role.role as CrimeSceneInvestigator
	if (role.getUses() >= role.config.maximumUses) {
		await message.reply(":x: You have already used your investigative ability!")
		return
	}
	if (params.length === 0 || params.length > 2 || (params.length == 2 && params[1] !== "confirm")) {
		throw new CommandUsageError()
	}
	const playerMatch = game.getPlayerMatch(params[0])
	if (playerMatch.score < 0.7) {
		await message.reply(":x: Unknown player")
		return
	}
	const target = playerMatch.player
	if (player === target) {
		await message.reply("You can't use your ability on yourself!")
		return
	}

	const cause = game
		.getAllPeriodLogEntries()
		.flatMap((entry) => entry.death_broadcasts)
		.find((broadcast) => broadcast.playerId === target.identifier)

	if (cause) {
		const visitor = game.getPlayer(cause.circumstances.attacker || "")

		if (cause.reason === "__lynched__") {
			await message.reply(":x: That player was lynched!")
		} else if ((cause.reason !== "killed" && cause.reason !== "__kill__") || !visitor) {
			await message.reply(":x: It is not within your capabilities to investigate that death")
		} else {
			if (params.length !== 2 || params[1] !== "confirm") {
				await message.reply(
					":warning: Please confirm you wish to investigate the death of **" +
						target.getDisplayName() +
						"** by using `!investigate <player> confirm`"
				)
			} else {
				await message.reply(
					":mag_right: You have decided to investigate **" + target.getDisplayName() + "** today\n"
				)
				await handleInvestigate(game, message, player, visitor)
			}
		}
	} else {
		await message.reply(":x: That player is not dead!")
	}
}

investigate.PRIVATE_ONLY = true
investigate.DEAD_CANNOT_USE = true
investigate.ALIVE_CANNOT_USE = false
investigate.DISALLOW_DAY = false
investigate.DISALLOW_NIGHT = true

export default makeCommand(investigate, {
	name: "investigate",
	description: "Investigate a crime scene",
	usage: "investigate <player>",
})
