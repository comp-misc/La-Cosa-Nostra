import { RoleActionable } from "../../../../../systems/actionables"
import attributeDecrement from "../../../../../rolesystem/modular/attributeDecrement"
import basicKidnap from "../../../../../rolesystem/prototypes/basicKidnap"
import basicCommute from "../../../../forum-auxiliaries/rolesystem/prototypes/basicCommute"

const commute: RoleActionable = (actionable, game, params) => {
	basicKidnap.reason = "abducted"

	//I assumed this was required given basicCommute doesn't reference kidnap,
	//likely the above line is a typo/bug?
	basicCommute.reason = "abducted"
	basicCommute(actionable, game, params)

	attributeDecrement(actionable, game, params)
}

commute.TAGS = ["visit"]

export default commute
