import { RoleActionable } from "../../../../../systems/actionables"

const attacked: RoleActionable = (actionable, game) => {
	const player = game.getPlayerByIdentifierOrThrow(actionable.from)
	const attributes = player.attributes

	if (!player.attributes.some((x) => x.identifier === "protection")) {
		// Remove protection
		player.setGameStat("basic-defense", 0, "set")

		// Remove attacked primer
		game.actions.delete((x) => x.identifier === "a/protection/attacked" && x.from === actionable.from)
		return true
	}

	attributes.sort((a, b) => a.expiry - b.expiry)

	for (let i = 0; i < attributes.length; i++) {
		if (attributes[i].identifier !== "protection") {
			continue
		}

		if (typeof attributes[i].tags.amount === "number") {
			attributes[i].tags.amount--
		}

		if (attributes[i].tags.amount < 1) {
			// Remove
			attributes.splice(i, 1)
			break
		}
	}
}

export = attacked
