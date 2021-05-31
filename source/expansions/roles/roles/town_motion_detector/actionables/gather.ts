import { RoleActionable } from "../../../../../systems/actionables"

const gather: RoleActionable = (actionable, game) => {
	const visit_log = game.actions.visit_log
	const people = []

	for (const entry of visit_log) {
		if (entry.visitor === actionable.to) {
			// Target
			const visited = game.getPlayerOrThrow(entry.target || "No target")
			people.push("**" + visited.getDisplayName() + "**")
		}
		if (entry.target === actionable.to) {
			// Target
			const visitor = game.getPlayerOrThrow(entry.visitor || "No visitor")
			people.push("**" + visitor.getDisplayName() + "**")
		}
	}
	const tracker = game.getPlayerOrThrow(actionable.from)

	if (people.length > 0) {
		const message = ":mag_right:  The motion detector __did__ register movements during the night."

		game.addMessage(tracker, message)
	} else {
		game.addMessage(
			tracker,
			":mag_right:  The motion detector __did not__ register any movements during the night."
		)
	}
}

export default gather
