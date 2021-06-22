import { RoleActionable } from "../../../../../systems/actionables"

const gather: RoleActionable = (actionable, game) => {
	const from = game.getPlayerOrThrow(actionable.from)
	const target = game.getPlayerOrThrow(actionable.to)

	game.addMessage(
		from,
		`:mag_right: Your investigations reveal that **${target.getDisplayName()}**'s alignment is **${
			target.role.properties.alignment
		}**.`
	)
}

export default gather
