import { RoleActionable } from "../../../../../systems/actionables"
import basicKidnap from "../../../../../rolesystem/prototypes/basicKidnap"
import attributeDecrement from "../../../../../rolesystem/modular/attributeDecrement"

const jail: RoleActionable = async (actionable, game, params) => {
	basicKidnap.reason = "abducted"
	await basicKidnap(actionable, game, params)
	await attributeDecrement(actionable, game, params)
}

jail.TAGS = ["drivable", "visit"]

export default jail
