import { CommandUsageError, GameCommand } from "../CommandType"
import makeCommand from "../makeCommand"
import { FFStatus } from "../../systems/game_templates/Player"

const description = "Fast forward is a tool that skips the night when everyone has selected to fast forward"
const usage = `
 - '!ff auto' automatically fast forwards every night. Ideal for roles with no night actions
 - '!ff on' will fast forward only this night. Use this once you've completed all night actions
 - '!ff off' will stop fast forwarding this night
 - '!ff status' shows if you are currently fast forwarding
`.trim()

const getFFStatusDescription = (status: FFStatus): string => {
	switch (status) {
		case FFStatus.ON:
			return "You are fast forwarding this night"
		case FFStatus.AUTO:
			return "You are automatically fast forwarding this night and all future nights"
		case FFStatus.OFF:
			return "You are not currently fast forwarding the night"
	}
}

const fastforward: GameCommand = async (game, message, params) => {
	const config = game.config
	const player = game.getPlayerById(message.author.id)
	if (!player) {
		await message.channel.send(":x:  You are not in the game!")
		return
	}

	if (!player.status.alive) {
		await message.channel.send(":x:  Dead people may not fast forward!")
		return
	}

	if (!config.game["fast-forwarding"].allow) {
		await message.channel.send(":x:  Fast forwarding is disabled for this game!")
		return
	}

	if (player.getPrivateChannel().id !== message.channel.id) {
		await message.channel.send(":x:  You cannot use that command here!")
		return
	}

	if (params.length != 1) {
		throw new CommandUsageError()
	}

	const arg = params[0].toLowerCase()
	if (arg === "status" || arg === "info") {
		await message.reply(getFFStatusDescription(player.ffstatus))
		return
	}
	if (arg === "help") {
		await message.reply(description + "\nUsage:\n" + usage)
		return
	}

	if (arg === "auto") {
		player.ffstatus = FFStatus.AUTO
		await message.reply("You are now fast forwarding this night and all future nights. Disable this with '!ff off'")
	} else if (arg === "on") {
		player.ffstatus = FFStatus.ON
		await message.reply("You are now fast forwarding the night")
	} else if (arg === "off") {
		const currentStatus = player.ffstatus
		if (currentStatus == FFStatus.OFF) {
			await message.reply("You are not fast forwarding the night")
		} else {
			await message.reply("You are no longer fast forwarding the night")
		}
	} else {
		throw new CommandUsageError("Unknown action '" + params[0] + "'")
	}
}

fastforward.ALLOW_PREGAME = false
fastforward.ALLOW_GAME = true
fastforward.ALLOW_POSTGAME = false

export default makeCommand(fastforward, {
	name: "fastforward",
	description: description,
	usage: usage,
	aliases: ["ff"],
})
