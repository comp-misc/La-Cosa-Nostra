import { RoleActionable } from "../../../../../systems/actionables"
import basicJail from "../../../../../rolesystem/prototypes/basicJail"
import attributeDecrement from "../../../../../rolesystem/modular/attributeDecrement"

const jail: RoleActionable = async (actionable, game, params) => {
	await basicJail(actionable, game, "Ability")
	await attributeDecrement(actionable, game, params)
}

jail.TAGS = ["drivable", "visit"]

export default jail
