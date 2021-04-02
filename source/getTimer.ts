import Timer from "./systems/game_templates/Timer"

export const getTimer = (): Timer => {
	const timer = (process as any).timer
	if (!timer) {
		throw new Error("Timer not yet defined")
	}
	return timer
}

export const hasTimer = (): boolean => (process as any).timer instanceof Timer

export const setTimer = (timer: Timer): void => {
	;(process as any).timer = timer
}

export const removeTimer = (): void => {
	delete (process as any).timer
}
