import { getTimer, hasTimer } from "../../getTimer"
import { AdminCommand, CommandUsageError } from "../CommandType"
import makeCommand from "../makeCommand"

const listActionables: AdminCommand = async (message, params) => {
	if (!hasTimer() || !["pre-game", "playing"].includes(getTimer().game.state)) {
		await message.channel.send(":x: No game in progress.")
		return
	}
	let showDead = false
	if (params.length > 1) {
		throw new CommandUsageError()
	}
	if (params.length === 1) {
		if (params[0] === "true") showDead = true
		else if (params[0] === "false") showDead = false
		else throw new CommandUsageError(`Expected true or false, got '${params[0]}'`)
	}

	const game = getTimer().game
	const players = [...(showDead ? game.players : game.getAlivePlayers())]
	players.sort((p1, p2) => p1.alphabet.localeCompare(p2.alphabet))

	const result = players.map((p) => ` - ${p.alphabet}: ${p.role.getDeathName()} (${p.getDisplayName()})`).join("\n")
	await message.reply("Player Roles: ```yml\n" + result + "\n```")
}

export default makeCommand(listActionables, {
	name: "_player_roles",
	description: "Shows player alphabet/role pairs",
	usage: "_player_roles [show_dead]",
})
