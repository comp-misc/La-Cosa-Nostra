import { RoleActionable } from "../../../../../systems/actionables"
import basicRoleblock from "../../../../../rolesystem/prototypes/basicRoleblock"

const roleblock: RoleActionable = async (actionable, game) => {
	await basicRoleblock(actionable, game, "Mafia-Roleblocker")
}

roleblock.TAGS = ["drivable", "visit"]

export default roleblock
