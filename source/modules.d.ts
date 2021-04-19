import Logger from "./systems/game_templates/Logger"
import BotTimer from "./systems/game_templates/Timer"

declare global {
	namespace NodeJS {
		export interface Process {
			timer?: BotTimer
			logger?: Logger
		}
	}
}

export {}
