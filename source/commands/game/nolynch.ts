import { GameCommand } from "../CommandType"

const nolynch: GameCommand = async (game, message) => {
	const config = game.config

	if (!config.game.lynch["no-lynch-option"]) {
		await message.channel.send(":x:  The no-lynch vote is disabled.")
		return
	}

	if (!game.isDay()) {
		await message.channel.send(":x:  There is no trial during the night!")
		return
	}

	const self = game.getPlayerById(message.author.id)

	if (!self) {
		await message.channel.send(":x:  You are not in the game!")
		return
	}

	if (!self.isAlive()) {
		await message.channel.send(":x:  You have died and cannot vote!")
		return
	}

	const result = await game.toggleVote(self, "nl")

	if (!result) {
		await message.channel.send(":x:  You have used up all your votes for the day.")
	}
}

nolynch.ALLOW_PREGAME = false
nolynch.ALLOW_GAME = true
nolynch.ALLOW_POSTGAME = false

export default nolynch
