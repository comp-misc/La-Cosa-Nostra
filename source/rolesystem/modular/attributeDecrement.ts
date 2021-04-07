import { Actionable, ExecutionParams } from "../../systems/game_templates/Actions"
import Game from "../../systems/game_templates/Game"

const attributeDecrement = async <T>(
	actionable: Actionable<T>,
	game: Game,
	params?: ExecutionParams,
	greedy = false,
	log = true
): Promise<void> => {
	const player = game.getPlayerByIdentifier(actionable.from)
	if (!player) {
		throw new Error(`No player found with identifier '${actionable.from}'`)
	}

	const attributes = player.attributes

	// Check "a/<attribute>/<actionable>"
	const identifier = actionable.identifier.split("/")[1]

	if (log) {
		// Create a log if it does not exist
		if (!player.modular_log) {
			player.modular_log = []
		}

		player.modular_log.push(identifier)
	}

	// Scan through attributes
	for (let i = attributes.length - 1; i >= 0; i--) {
		if (attributes[i].identifier !== identifier) {
			continue
		}

		if (typeof attributes[i].tags.uses === "number") {
			attributes[i].tags.uses--
		}

		if (attributes[i].tags.uses < 1 && attributes[i].tags.uses !== "Infinity") {
			// Remove
			attributes.splice(i, 1)
		}

		if (!greedy) {
			break
		}
	}

	await game.execute("miscellaneous", {
		target: player.identifier,
		event: "modular_log_decrement",
		module: identifier,
	})
}

export = attributeDecrement
