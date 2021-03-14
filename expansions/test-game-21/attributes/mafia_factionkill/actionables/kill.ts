import { RoleActionable } from "../../../../../systems/actionables"
import { rolesystem } from "../../../../../lcn"

// Defaults to shooting
// Godfather can override

// See godfather/kill_vote

const kill: RoleActionable = (actionable, game, params) => {
	rolesystem.prototypes.basicAttack(actionable, game, params)
}

kill.TAGS = ["drivable", "roleblockable", "visit"]

export = kill