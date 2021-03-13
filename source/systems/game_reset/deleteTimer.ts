import getLogger from "../../getLogger"
import { getTimer, hasTimer } from "../../getTimer"

const deleteTimer = (): void => {
	const logger = getLogger()
	if (hasTimer()) {
		getTimer().destroy()

		delete (process as any).timer

		logger.log(2, "Destroyed previous Timer instance.")
	}
}

export = deleteTimer
