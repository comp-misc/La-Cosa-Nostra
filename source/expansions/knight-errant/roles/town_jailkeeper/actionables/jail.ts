import { RoleActionable } from "../../../../../systems/actionables"
import basicKidnap from "../../../../../rolesystem/prototypes/basicKidnap"

const jail: RoleActionable = (actionable, game, params) => {
	basicKidnap.reason = "abducted"
	basicKidnap(actionable, game, params)
}

jail.TAGS = ["drivable", "visit"]

export default jail
