import { RoleStart } from "../../../../../systems/Role"

// Executes BEFORE introduction
const start: RoleStart = (player) => {
	player.getGame().addAction("consigliere/promotion", ["cycle"], {
		from: player.id,
		to: player.id,
		expiry: Infinity,
		tags: ["permanent"],
		priority: 12,
	})
}

export = start
