import Logger from "./systems/game_templates/Logger"

export = (): Logger => {
	const logger = (process as any)["logger"]
	if (!logger) {
		throw new Error("Logger not yet defined")
	}
	return logger
}
