import Timer from "./systems/game_templates/Timer"

export const getTimer = (): Timer => {
	const timer = process.timer
	if (!timer) {
		throw new Error("Timer not yet defined")
	}
	return timer
}

export const hasTimer = (): boolean => process.timer instanceof Timer

export const setTimer = (timer: Timer): void => {
	process.timer = timer
}

export const removeTimer = (): void => {
	delete process.timer
}
