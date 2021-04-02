import { AttributeStart } from "../../../../../systems/Attribute"

const start: AttributeStart = (player) => {
	player.setPermanentStat("detection-immunity", 1, "set")
}

start.DO_NOT_RUN_ON_GAME_START = false
start.DO_NOT_RUN_ON_ADDITION = false

export default start
