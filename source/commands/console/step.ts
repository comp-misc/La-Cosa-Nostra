import { ConsoleCommand } from "../CommandType"

import { hasTimer, getTimer } from "../../getTimer"

const step: ConsoleCommand = async () => {
	if (!hasTimer()) {
		console.log("No game in progress")
		return
	}
	const timer = getTimer()
	if (!["pre-game", "playing"].includes(timer.game.state)) {
		console.log("No game in progress")
		return
	}
	await timer.step()
	console.log("Step set.")
}

export default step
