import { RoleActionable } from "../../../../../systems/actionables"
import basicAttack from "../../../../../rolesystem/prototypes/basicAttack"

const kill: RoleActionable = (actionable, game, params) => {
	basicAttack(actionable, game, params)
}

kill.TAGS = ["drivable", "roleblockable", "visit"]

export default kill
