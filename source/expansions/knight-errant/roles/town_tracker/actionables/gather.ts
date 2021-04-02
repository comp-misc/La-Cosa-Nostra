import pettyFormat from "../../../../../auxils/pettyFormat"
import { RoleActionable } from "../../../../../systems/actionables"

const gather: RoleActionable = (actionable, game) => {
	const visit_log = game.actions.visit_log
	const visited_names = []

	for (const visit of visit_log) {
		if (visit.visitor === actionable.to && visit.target) {
			// Target
			const visited = game.getPlayerOrThrow(visit.target)
			visited_names.push("**" + visited.getDisplayName() + "**")
		}
	}

	const tracker = game.getPlayerOrThrow(actionable.from)

	visited_names.sort()

	if (visited_names.length > 0) {
		const message = ":mag: Your target visited " + pettyFormat(visited_names) + " last night."

		game.addMessage(tracker, message)
	} else {
		game.addMessage(tracker, ":mag: Your target did not visit anybody last night.")
	}
}

export default gather
