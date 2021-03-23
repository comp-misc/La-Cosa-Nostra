import Player from "../../../../systems/game_templates/Player"

const investigationImmunity = (player: Player): boolean => {
	const attributes = player.attributes

	const immune = attributes.some(
		(x) => x.identifier === "arbitrary" && x.tags.type === "investigation_immunity" && x.tags.amount > 0
	)

	if (!immune) {
		return immune
	}

	attributes.sort((a, b) => a.expiry - b.expiry)

	for (let i = 0; i < attributes.length; i++) {
		if (attributes[i].identifier !== "arbitrary" && attributes[i].tags.type === "investigation_immunity") {
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

	return immune
}

export default investigationImmunity
