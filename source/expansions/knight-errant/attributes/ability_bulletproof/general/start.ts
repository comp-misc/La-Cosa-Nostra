import { AttributeStart } from "../../../../../systems/Attribute"

const start: AttributeStart = (player, attribute) => {
	player.addAttribute("protection", Infinity, { amount: attribute.tags.uses })

	attribute.expiry = 0
}

start.DO_NOT_RUN_ON_GAME_START = false
start.DO_NOT_RUN_ON_ADDITION = false

export default start
