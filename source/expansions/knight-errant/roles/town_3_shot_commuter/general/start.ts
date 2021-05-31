// Executes BEFORE introduction

import { RoleStart } from "../../../../../systems/Role"

const start: RoleStart = (player) => {
	player.misc.commutes_left = 3
}

export default start
