import Player from "../../systems/game_templates/Player"

const hasModule = (player: Player, name: string, category?: string): boolean => {
	const attributes = player.attributes

	if (category) {
		return attributes.some(
			(x) =>
				x.attribute.modular &&
				x.attribute.name.toLowerCase() === name.toLowerCase() &&
				x.attribute["modular-details"]["cluster"].toLowerCase() === category.toLowerCase()
		)
	} else {
		return attributes.some((x) => x.attribute.modular && x.attribute.name.toLowerCase() === name.toLowerCase())
	}
}

export = hasModule
