import { RoleStart } from "../../../../../systems/Role"

const start: RoleStart = (player) => {
	if (
		!player.getGame().actions.exists((x) => x.identifier === "a/invincibility/attacked" && x.from === player.identifier)
	) {
		// Add attacked primer
		player.getGame().addAction("a/invincibility/attacked", ["attacked"], {
			name: "Invincibility-primer",
			from: player.id,
			to: player.id,
			expiry: Infinity,
			priority: 1,
			tags: ["permanent"],
		})
	}

	player.setGameStat("basic-defense", 4, Math.max)
}

export = start
