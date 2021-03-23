// Executes BEFORE introduction

import { RoleStart } from "../../../../../systems/Role"

const start: RoleStart = (player) => {
	player.getGame().addAction("mafia_even_night_watcher/roleblock_noresult", ["roleblock"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})

	player.addAttribute("mafia_factionkill")
}

export default start
