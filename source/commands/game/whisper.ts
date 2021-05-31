import { GameCommand } from "../CommandType"

const whisper: GameCommand = async (game, message, params) => {
	const config = game.config

	if (!config.game.whispers.allow) {
		await message.channel.send(":x:  Whispers are not allowed in this game!")
		return
	}

	const day = game.isDay()

	if (day && !config.game.whispers.day) {
		await message.channel.send(":x:  You may not whisper during the day.")
		return
	}

	if (!day && !config.game.whispers.night) {
		await message.channel.send(":x:  You may not whisper at night.")
		return
	}

	if (params.length < 2) {
		await message.channel.send(
			":x:  Wrong syntax! Use `" + config["command-prefix"] + "whisper <alphabet/name> <message>` instead!"
		)
		return
	}

	const target = params[0]
	const context = Array.from(params).splice(1, Infinity).join(" ")

	const player = game.getPlayerMatch(target)

	if (player.score < 0.7) {
		// Disallow
		await message.channel.send(
			":x:  I cannot find that player! Try again using `" +
				config["command-prefix"] +
				"whisper <alphabet/name> <message>`!"
		)
		return
	}

	const thePlayer = player.player

	const sender = game.getPlayerById(message.author.id)

	if (sender === null) {
		await message.channel.send(":x:  You are not in the game!")
		return
	}

	if (sender.channel?.id !== message.channel.id) {
		await message.channel.send(":x:  You cannot use that command here!")
		return
	}

	if (thePlayer.isSame(sender)) {
		await message.channel.send(":x:  You cannot whisper to yourself. That would be weird.")
		return
	}

	if (!thePlayer.status.alive && config.game.whispers["allow-dead"]) {
		await message.channel.send(":x:  You are dead! How can you send whispers?")
		return
	}

	if (params.length < 2) {
		await message.channel.send(
			":x:  Wrong syntax! Use `" + config["command-prefix"] + "whisper <alphabet/name> <message>` instead!"
		)
		return
	}

	if (!thePlayer.hasPrivateChannel()) {
		await message.channel.send(":x:  You cannot use that command here!")
		return
	}

	const target_channel = thePlayer.getPrivateChannel()
	const sender_channel = game.findTextChannel(sender.channel.id)
	const whisper_log = game.getWhisperLogChannel()

	const d_player = thePlayer.getGuildMember() || {
		displayName: "undef'd-player",
		user: { username: "undef'd-player" },
	}
	const d_sender = message.member

	await sender_channel.send(":speech_left:  **You** → **" + d_player.displayName + "**: " + context)
	await target_channel.send(":speech_balloon:  **" + d_sender.displayName + "** → **You**: " + context)

	if (whisper_log !== undefined && config.game.whispers.broadcast) {
		await whisper_log.send(
			":speech_left:  **" + d_sender.displayName + "** is whispering to **" + d_player.displayName + "**."
		)
	}

	await message.delete()
}

whisper.ALLOW_PREGAME = false
whisper.ALLOW_GAME = true
whisper.ALLOW_POSTGAME = false

export default whisper
