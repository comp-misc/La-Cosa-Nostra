// Executes BEFORE introduction

import { RoleStart } from "../../../systems/Role"

const start: RoleStart = (player) => (player.misc.apothecarist_poisons_left = 2)

export = start
