// Executes BEFORE introduction

import { AttributeStart } from "../../../../../systems/Attribute"
import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"

const start: AttributeStart = async (player) => {
	if (
		player
			.getGame()
			.actions.find((x) => x.from === player.identifier && x.identifier === "a/ability_track/roleblock_noresult")
	) {
		return
	}

	await player.getGame().addAction("a/ability_track/roleblock_noresult", ["roleblock"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
		priority: ActionPriorities.HIGH,
	})
}

export default start
