import { Actionable } from "../../systems/game_templates/Actions"
import Game from "../../systems/game_templates/Game"

const logSuccess = <T>(actionable: Actionable<T>, game: Game): void => {
	const player = game.getPlayerByIdentifier(actionable.from)
	if (!player) {
		throw new Error(`Unknown player '${actionable.from}'`)
	}
	// Check "a/<attribute>/<actionable>"
	const identifier = actionable.identifier.split("/")[1]

	// Create a log if it does not exist
	if (!player.modular_success_log) {
		player.modular_success_log = []
	}

	player.modular_success_log.push(identifier)

	game.execute("miscellaneous", { target: player.identifier, event: "modular_log_success", module: identifier })
}

export = logSuccess
