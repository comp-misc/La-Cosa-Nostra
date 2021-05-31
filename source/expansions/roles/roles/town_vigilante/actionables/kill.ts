import basicAttack from "../../../../../rolesystem/prototypes/basicAttack"
import { RoleActionable } from "../../../../../systems/actionables"

const kill: RoleActionable = async (actionable, game, params) => {
	await basicAttack(actionable, game, params)
}
kill.TAGS = ["drivable", "visit"]

export default kill
