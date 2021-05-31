// Executes BEFORE introduction

import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"
import { RoleStart } from "../../../../../systems/Role"

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
