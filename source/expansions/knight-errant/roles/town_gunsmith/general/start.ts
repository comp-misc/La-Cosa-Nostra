// Executes BEFORE introduction

import { RoleStart } from "../../../../../systems/Role"

const start: RoleStart = (player) => {
	player.getGame().addAction("town_gunsmith/roleblock_noresult", ["roleblock"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})
}

export default start