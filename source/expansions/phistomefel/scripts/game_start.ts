import { GameStartScript } from "../../../Expansion"

const gameStart: GameStartScript = async (game) => {
	await game.sendPin(
		game.getChannel("neighbours-chat"),
		"**This is the Neighbours' Chat.**\n\nThis channel is only open at night for Neighbours to discuss."
	)
}

export default gameStart
