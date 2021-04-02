import pettyFormat from "../../../../../auxils/pettyFormat"
import { RoleActionable } from "../../../../../systems/actionables"

const gather: RoleActionable = (actionable, game) => {
	const visit_log = game.actions.visit_log
	const visitor_names = []

	for (const entry of visit_log) {
		if (entry.target === actionable.to && entry.visitor) {
			// Target
			const visitor = game.getPlayerOrThrow(entry.visitor)
			visitor_names.push("**" + visitor.getDisplayName() + "**")
		}
	}

	const lookout = game.getPlayerOrThrow(actionable.from)

	visitor_names.sort()

	if (visitor_names.length > 0) {
		const message = ":telescope: " + pettyFormat(visitor_names) + " visited your target last night."

		game.addMessage(lookout, message)
	} else {
		game.addMessage(lookout, ":telescope: Nobody visited your target last night.")
	}
}

export default gather
