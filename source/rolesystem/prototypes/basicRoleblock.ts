import { Actionable } from "../../systems/game_templates/Actions"
import Game from "../../systems/game_templates/Game"

const basicRoleblock = async <T>(
	actionable: Actionable<T>,
	game: Game,
	roleName: string,
	params?: {
		visitType?: string
		/** Threshold where a player with this level of immunity will not be roleblocked */
		immunityThreshold?: number
		showVisit?: boolean
	}
): Promise<void> => {
	const target = game.getPlayerOrThrow(actionable.to)
	const { visitType = "roleblock", immunityThreshold = 1, showVisit = true } = params || {}

	if (showVisit) {
		await game.execute("visit", {
			visitor: actionable.from,
			target: actionable.to,
			priority: actionable.priority,
			reason: roleName + "-visit",
			type: visitType,
		})
	}

	const immunity = target.getStat("roleblock-immunity", Math.max)

	if (immunity < immunityThreshold) {
		await game.execute("roleblock", {
			roleblocker: actionable.from,
			target: actionable.to,
			priority: actionable.priority,
			reason: roleName + "-" + visitType,
		})
		game.actions.delete((x) => x.from === target.identifier && x.tags.includes("roleblockable"))
		target.setStatus("roleblocked", true)
	}
}

export default basicRoleblock
