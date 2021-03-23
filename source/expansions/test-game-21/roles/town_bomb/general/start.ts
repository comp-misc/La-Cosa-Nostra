import { RoleStart } from "../../../../../systems/Role"

// Executes BEFORE introduction
const start: RoleStart = (player) => {
	player.getGame().addAction("town_bomb/attacked", ["attacked"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})
}

export = start
