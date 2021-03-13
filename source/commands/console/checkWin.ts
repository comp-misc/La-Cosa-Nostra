import { getTimer, hasTimer } from "../../getTimer"
import { ConsoleCommand } from "../CommandType"

const checkWin: ConsoleCommand = () => {
	if (!hasTimer()) {
		console.log("No game active")
		return
	}
	const { game } = getTimer()
	game.checkWin()

	console.log("Win check complete.")
}

export = checkWin
