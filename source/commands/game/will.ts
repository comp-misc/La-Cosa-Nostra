import { GameCommand } from "../CommandType"

const will: GameCommand = async (game, message, params) => {
	const config = game.config

	const player = game.getPlayerById(message.author.id)

	// Check existent
	if (player === null) {
		await message.channel.send(":x: You are not in the game!")
		return null
	}

	if (!config["game"]["last-wills"]["allow"]) {
		await message.channel.send(":x: Last wills are disabled in this game!")
		return null
	}

	if (!player.status.alive) {
		await message.channel.send(":x: Dead people cannot write wills!")
		return null
	}

	// Check private channel
	if (player.channel?.id !== message.channel.id) {
		await message.channel.send(":x: You cannot use that command here!")
		return null
	}

	if (params.length < 1) {
		await message.channel.send(
			":x: Wrong syntax! Use `" + config["command-prefix"] + "will <view/write/clear> [will]` instead!"
		)
		return null
	}

	const action = params[0]
	let will: string | undefined = params.splice(1, Infinity).join(" ")

	switch (action) {
		case "view": {
			will = player.getTrueWill()

			let send: string
			if (will !== undefined) {
				send =
					":pen_fountain: Your current last will:\n```fix\n" +
					will +
					"```\n\nUse `" +
					config["command-prefix"] +
					"will write <will>` to change it!"
			} else {
				send =
					":pen_fountain: You do not have a last will yet!\n\nUse `" +
					config["command-prefix"] +
					"will write <will>` to change it!"
			}

			await message.channel.send(send)
			break
		}
		case "write": {
			if (/`/g.test(will)) {
				await message.channel.send(":x: Please do not use code formatting in last wills!")
				return null
			}

			will = will.trim().replace(/^\s+|\s+$/g, "")

			const char_limit: number = config["game"]["last-wills"]["character-count-limit"]

			if (will.length > char_limit) {
				await message.channel.send(":x: Last wills cannot exceed " + char_limit + " characters!")
				return null
			}

			if (will.length === 0) {
				// Unset

				player.setWill(undefined)

				await message.channel.send(":pen_ballpoint: You have removed your last will.")
			} else {
				player.setWill(will)

				await message.channel.send(
					":pen_ballpoint: You have changed your last will.\n\nUse `" +
						config["command-prefix"] +
						"will view` to view it."
				)
			}
			break
		}
		case "clear": {
			// Unset

			player.setWill(undefined)

			await message.channel.send(":pen_ballpoint: You have removed your last will.")
			break
		}
		default:
			await message.channel.send(
				":x: Wrong syntax! Use `" + config["command-prefix"] + "will <view/write> [will]` instead!"
			)
			break
	}

	game.save()
}

will.ALLOW_PREGAME = false
will.ALLOW_GAME = true
will.ALLOW_POSTGAME = false

export = will
