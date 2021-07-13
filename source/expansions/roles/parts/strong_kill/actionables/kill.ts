import powerfulAttack from "../../../../../rolesystem/prototypes/powerfulAttack"
import { RoleActionable } from "../../../../../systems/actionables"

const kill: RoleActionable = async (actionable, game, params) => {
	await powerfulAttack(actionable, game, params)
}
kill.TAGS = ["drivable", "roleblockable", "visit"]

export default kill
