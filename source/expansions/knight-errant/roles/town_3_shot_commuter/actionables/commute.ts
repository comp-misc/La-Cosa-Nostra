import { RoleActionable } from "../../../../../systems/actionables"
import basicKidnap from "../../../../../rolesystem/prototypes/basicKidnap"
import basicCommute from "../../../../forum-auxiliaries/rolesystem/prototypes/basicCommute"

const commute: RoleActionable = (actionable, game, params) => {
	const target = game.getPlayerOrThrow(actionable.to)

	basicKidnap.reason = "commute"

	//I assumed this was required given basicCommute doesn't reference kidnap,
	//likely the above line is a typo/bug?
	basicCommute.reason = "commute"
	basicCommute(actionable, game, params)

	target.misc.commutes_left--
}

commute.TAGS = ["visit"]

export default commute
