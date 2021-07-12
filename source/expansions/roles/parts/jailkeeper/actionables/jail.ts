import { RoleActionable } from "../../../../../systems/actionables"
import basicJail from "../../../../../rolesystem/prototypes/basicJail"

const jail: RoleActionable = async (actionable, game) => {
	await basicJail(actionable, game, "Jailkeeper")
}

jail.TAGS = ["drivable", "roleblockable", "visit"]

export default jail
