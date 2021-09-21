import { RoleActionable } from "../../../../../systems/actionables"
import cfl from "../../../../../auxils/capitaliseFirstLetter"
import AlignmentCop from ".."
import { formatAlignment } from "../../../../../role"

const gather: RoleActionable = (actionable, game) => {
	const from = game.getPlayerOrThrow(actionable.from)
	const target = game.getPlayerOrThrow(actionable.to)

	const copRole = from.role.getPartOrThrow(AlignmentCop)

	const properties = target.role.properties
	const alignments = properties.alignmentInvestigation
	const roleAlignment = alignments.length > 0 ? alignments[0] : formatAlignment(properties.alignment)

	let alignmentToShow = roleAlignment

	const immunity = target.getStat("detection-immunity", Math.max)
	if (immunity < 1) {
		const responses = copRole.config.alignmentResponses
		if (responses && roleAlignment in responses) {
			alignmentToShow = responses[roleAlignment]
		}
	} else {
		alignmentToShow = copRole.config.investigationImmuneResponse || "Town"
	}

	game.addMessage(
		from,
		`:mag_right: Your investigations reveal that **${target.getDisplayName()}**'s alignment is **${cfl(
			alignmentToShow
		)}**.`
	)
}

export default gather
