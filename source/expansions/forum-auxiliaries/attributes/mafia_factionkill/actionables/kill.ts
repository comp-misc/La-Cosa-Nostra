import { RoleActionable } from "../../../../../systems/actionables"
import basicAttack from "../../../../../rolesystem/prototypes/basicAttack"

// Defaults to shooting
// Godfather can override

// See godfather/kill_vote

const kill: RoleActionable = (actionable, game, params) => {
	basicAttack(actionable, game, params)
}

kill.TAGS = ["drivable", "roleblockable", "visit"]

export default kill
