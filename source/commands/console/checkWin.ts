import { getTimer, hasTimer } from "../../getTimer"
import { ConsoleCommand } from "../CommandType"

const checkWin: ConsoleCommand = async () => {
	if (!hasTimer()) {
		console.log("No game active")
		return
	}
	const { game } = getTimer()
	await game.checkWin()

	console.log("Win check complete.")
}

export = checkWin
