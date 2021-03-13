import { RoleStart } from "../../../../../source/systems/Role"

const start: RoleStart = (player) => {
	if (
		!player.getGame().actions.exists((x) => x.identifier === "a/protection/attacked" && x.from === player.identifier)
	) {
		// Add attacked primer
		player.getGame().addAction("a/protection/attacked", ["attacked"], {
			name: "Protection-primer",
			from: player.id,
			to: player.id,
			expiry: Infinity,
			priority: 1,
			tags: ["permanent"],
		})
	}

	player.setGameStat("basic-defense", 2, Math.max)
}

export = start
