import attributeDecrement from "../../../../../rolesystem/modular/attributeDecrement"
import basicCommute from "../../../../../rolesystem/prototypes/basicCommute"
import { RoleActionable } from "../../../../../systems/actionables"

const commute: RoleActionable = async (actionable, game, params) => {
	//I assumed this was required given basicCommute doesn't reference kidnap,
	//likely the above line is a typo/bug?
	basicCommute.reason = "abducted"
	await basicCommute(actionable, game, params)

	await attributeDecrement(actionable, game, params)
}

commute.TAGS = ["visit"]

export default commute
