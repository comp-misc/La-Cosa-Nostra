import makeCommand from "../../makeCommand"
import { getTextChannel } from "../../../MafiaBot"
import { UnaffiliatedCommand } from "../../CommandType"
import { getRequiredPlayers } from "../../createSignupCommand"

const players: UnaffiliatedCommand = async (message, params, config) => {
	const channel = getTextChannel("signup-channel")
	if (message.channel.id !== channel.id) {
		await message.reply(`:x: Please use <#${channel.id}>`)
		return
	}
	const players = message.guild.members.cache
		.filter((player) => player.roles.cache.some((r) => r.name === config.permissions.pre))
		.array()
	if (players.length === 0) {
		await message.reply(":exclamation: There are no players currently signed up to the game")
		return
	}
	const playerList = players.map((player, i) => `${i + 1}. ${player.displayName} (${player.id})`)
	const requiredPlayers = getRequiredPlayers(message.guild, config)

	const playersFormat = requiredPlayers ? `${players.length}/${requiredPlayers}` : players.length.toString()
	const playerListFormat = "```python" + "\n" + playerList.join("\n") + "\n```"
	await message.reply(`:page_facing_up: **Players (${playersFormat})**:page_facing_up:` + playerListFormat)
}

export default makeCommand(players, {
	name: "players",
	description: "Shows players currently signed up for the game",
	aliases: ["list", "l"],
})
