import { RoleStart } from "../../../../../source/systems/Role"

// Executes BEFORE introduction
const start: RoleStart = (player) => {
	player.getGame().addAction("town_bomb/attacked", ["attacked"], {
		from: player.id,
		to: player.id,
		expiry: Infinity,
		tags: ["permanent"],
	})
}

export = start
