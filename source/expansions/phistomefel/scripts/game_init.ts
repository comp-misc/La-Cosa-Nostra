import { GameInitScript } from "../../../Expansion"

const gameInit: GameInitScript = async (game) => {
	await game.createPrivateChannel("neighbours-chat", [])
}

export default gameInit
