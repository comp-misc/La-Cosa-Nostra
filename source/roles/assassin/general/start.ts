// Executes BEFORE introduction

import { RoleStart } from "../../../systems/Role"

const start: RoleStart = (player) => {
	player.misc.assassin_picked_target = false
	player.misc.assassin_target = null
}

export = start
