import { RoleActionable } from "../../../../../systems/actionables"

const attacked: RoleActionable = (actionable, game) => {
	const player = game.getPlayerOrThrow(actionable.from)
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
		const attribute = attributes[i]
		if (attribute.identifier !== "protection") {
			continue
		}

		if (typeof attribute.tags.amount === "number") {
			attribute.tags.amount--
			if (attribute.tags.amount < 1) {
				// Remove
				attributes.splice(i, 1)
				break
			}
		}
	}
}

export default attacked
