import Player from "../../../systems/game_templates/Player"
import BaseMafiaConfig from "./BaseMafiaConfig"

export const MAFIA_SIDE_ACTION_TAG = "mafia_factional_side" as const
export const MAFIA_MAIN_ACTION_TAG = "mafia_factional_main" as const

const deleteMafiaAction = (from: Player, actionId: string, isSideAction: boolean): void => {
	const allowMultiple = checkAllowsMultiple(from)
	const actions = from.getGame().actions
	if (!allowMultiple) {
		actions.delete(
			(x) =>
				(x.from === from.identifier && x.tags.includes(MAFIA_SIDE_ACTION_TAG)) ||
				x.tags.includes(MAFIA_MAIN_ACTION_TAG) ||
				(x.from === from.identifier && x.identifier === actionId)
		)
	} else {
		if (isSideAction) {
			actions.delete((x) => x.from === from.identifier && x.identifier === actionId)
		} else {
			actions.delete((x) => x.identifier === actionId && x.tags.includes(MAFIA_MAIN_ACTION_TAG))
		}
	}
}

const checkAllowsMultiple = (player: Player): boolean => {
	const role = player.role
	const config = role.role.config as Record<string, unknown>
	if (config && "allowMultipleActions" in config) {
		const mafiaConfig = config as unknown as BaseMafiaConfig
		return mafiaConfig.allowMultipleActions
	}
	return false
}

export default deleteMafiaAction
