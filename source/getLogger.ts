import Logger from "./systems/game_templates/Logger"

const getLogger = (): Logger => {
	const logger = process.logger
	if (!logger) {
		throw new Error("Logger not yet defined")
	}
	return logger
}

export default getLogger
