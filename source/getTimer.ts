import Timer from "./systems/game_templates/Timer"

export const getTimer = (): Timer => {
	const logger = (process as any)["timer"]
	if (!logger) {
		throw new Error("Timer not yet defined")
	}
	return logger
}

export const hasTimer = (): boolean => !!(process as any)["timer"]
