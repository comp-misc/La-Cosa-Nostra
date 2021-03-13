import { getTimer, hasTimer } from "../../getTimer"
import { ConsoleCommand } from "../CommandType"

const actions: ConsoleCommand = () => {
	if (!hasTimer()) {
		console.log("No game active")
		return
	}
	const { game } = getTimer()
	console.log(game.actions.actions)
}

export = actions
