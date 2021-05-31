import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"
import { RoleStart } from "../../../../../systems/Role"

const start: RoleStart = async (player) => {
	if (
		!player
			.getGame()
			.actions.exists((x) => x.identifier === "a/protection/attacked" && x.from === player.identifier)
	) {
		// Add attacked primer
		await player.getGame().addAction("a/protection/attacked", ["attacked"], {
			name: "Protection-primer",
			from: player,
			to: player,
			expiry: Infinity,
			priority: ActionPriorities.HIGH,
			tags: ["permanent"],
		})
	}

	player.setGameStat("basic-defense", 2, Math.max)
}

export default start
