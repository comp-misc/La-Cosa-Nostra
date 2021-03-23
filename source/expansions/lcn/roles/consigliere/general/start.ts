import { RoleStart } from "../../../../../systems/Role"

// Executes BEFORE introduction
const start: RoleStart = (player) => {
	player.getGame().addAction("consigliere/promotion", ["cycle"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
		priority: 12,
	})
}

export = start
