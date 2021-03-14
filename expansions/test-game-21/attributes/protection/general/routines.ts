import { RoleRoutine } from "../../../../../systems/Role"

const routines: RoleRoutine = (player) => player.setGameStat("basic-defense", 2, Math.max)

routines.ALLOW_DEAD = false
routines.ALLOW_NIGHT = true
routines.ALLOW_DAY = true

export = routines