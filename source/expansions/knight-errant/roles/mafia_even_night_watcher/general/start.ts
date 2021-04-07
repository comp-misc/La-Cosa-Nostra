// Executes BEFORE introduction

import { RoleStart } from "../../../../../systems/Role"

const start: RoleStart = async (player) => {
	await player.getGame().addAction("mafia_even_night_watcher/roleblock_noresult", ["roleblock"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})

	await player.addAttribute("mafia_factionkill")
}

export default start
