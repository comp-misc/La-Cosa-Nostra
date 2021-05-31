import getLogger from "../../getLogger"
import { getTimer, hasTimer, removeTimer } from "../../getTimer"

const deleteTimer = (): void => {
	const logger = getLogger()
	if (hasTimer()) {
		getTimer().destroy()
		removeTimer()

		logger.log(2, "Destroyed previous Timer instance.")
	}
}

export default deleteTimer
