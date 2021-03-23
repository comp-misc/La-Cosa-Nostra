// Executes BEFORE introduction

import { RoleStart } from "../../../../../systems/Role"

const start: RoleStart = (player) => {
	player.getGame().addAction("arsonist/attacked", ["attacked"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})
}

export = start
