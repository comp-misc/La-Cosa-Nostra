// Executes BEFORE introduction

import { RoleStart } from "../../../../../role"
import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"

const start: RoleStart = async (player) => {
	await player.getGame().addAction("town_gunsmith/roleblock_noresult", ["roleblock"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
		priority: ActionPriorities.HIGH,
	})
}

export default start
