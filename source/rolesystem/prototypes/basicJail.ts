import { Actionable } from "../../systems/game_templates/Actions"
import Game from "../../systems/game_templates/Game"
import basicRoleblock from "./basicRoleblock"

const basicJail = async <T>(
	actionable: Actionable<T>,
	game: Game,
	roleName: string,
	params?: {
		visitType?: string
		immunityThreshold?: number
		protectionLevel?: number
	}
): Promise<boolean> => {
	const target = game.getPlayerOrThrow(actionable.to)
	const { visitType = "jail", immunityThreshold = 1, protectionLevel = 2 } = params || {}

	await game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: roleName + "-visit",
		type: visitType,
	})

	if (target.getStat("kidnap-immunity", Math.max) >= immunityThreshold) {
		return false
	}

	await basicRoleblock(actionable, game, roleName, {
		immunityThreshold: Infinity,
		visitType,
		showVisit: false,
	})

	await target.addAttribute("protection", 1, { amount: protectionLevel })

	return true
}

export default basicJail
