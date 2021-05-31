import { RoleActionable } from "../../../../../systems/actionables"
import basicAttack from "../../../../../rolesystem/prototypes/basicAttack"

const kill: RoleActionable = async (actionable, game, params) => {
	await basicAttack(actionable, game, params)
}

kill.TAGS = ["drivable", "roleblockable", "visit"]

export default kill
