import deleteTimer from "../../systems/game_reset/deleteTimer"
import deleteCaches from "../../systems/game_setters/deleteCaches"
import { ConsoleCommand } from "../CommandType"

const uninstaniate: ConsoleCommand = () => {
	deleteTimer()
	deleteCaches()
}

export default uninstaniate
