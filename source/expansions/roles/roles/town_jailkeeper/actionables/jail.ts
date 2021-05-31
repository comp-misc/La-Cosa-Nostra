import { RoleActionable } from "../../../../../systems/actionables"
import basicJail from "../../../../../rolesystem/prototypes/basicJail"

const jail: RoleActionable = async (actionable, game) => {
	await basicJail(actionable, game, "Town-Jailkeeper")
}

jail.TAGS = ["drivable", "visit"]

export default jail
