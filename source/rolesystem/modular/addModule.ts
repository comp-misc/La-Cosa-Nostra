import Player from "../../systems/game_templates/Player"
import hasModule from "./hasModule"

const addModule = (player: Player, attribute_name: string, increment = 1): void => {
	if (hasModule(player, attribute_name)) {
		const attribute = player.attributes.find(
			(x) => x.attribute.modular && x.attribute.name.toLowerCase() === attribute_name.toLowerCase()
		)

		if (!attribute) {
			throw new Error(`No attribute found with name '${attribute_name}'`)
		}
		if (attribute.tags.uses !== Infinity) {
			attribute.tags.uses += increment
		}
	} else {
		// Add module
		player.addAttribute(attribute_name, Infinity, { uses: increment })
	}
}

export = addModule
