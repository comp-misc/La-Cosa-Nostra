import { GameStartScript } from "../../../Expansion"

const gameStart: GameStartScript = async (game) => {
	await game.createPrivateChannel("party", [])
}

export default gameStart
