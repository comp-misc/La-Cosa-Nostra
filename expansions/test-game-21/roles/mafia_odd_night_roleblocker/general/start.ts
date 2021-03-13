// Executes BEFORE introduction

import { RoleStart } from "../../../../../source/systems/Role"

const start: RoleStart = (player) => player.addAttribute("mafia_factionkill")

export = start
