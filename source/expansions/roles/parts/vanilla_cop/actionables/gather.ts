import VanillaCop from ".."
import { RoleActionable } from "../../../../../systems/actionables"

const gather: RoleActionable = (actionable, game) => {
	const from = game.getPlayerOrThrow(actionable.from)
	const target = game.getPlayerOrThrow(actionable.to)

	const copRole = from.role.getPartOrThrow(VanillaCop)

	const isVanilla = target.role.properties.investigation.some((name) => name === copRole.vanillaRole)
	game.addMessage(
		from,
		`:mag_right: Your investigations reveal that **${target.getDisplayName()}** is${
			isVanilla ? "" : " __not__"
		} **${copRole.showVanillaAs}**.`
	)
}

export default gather
