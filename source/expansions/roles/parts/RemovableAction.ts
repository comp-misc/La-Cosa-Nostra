import { Message } from "discord.js"
import { Actionable } from "../../../systems/game_templates/Actions"
import Player from "../../../systems/game_templates/Player"

export interface ExclusiveActionConfig {
	/**
	 * Whether the player is only able to execute a single action per night
	 */
	singleAction?: boolean
}

export default interface RemovableAction {
	getExistingAction(from: Player): Actionable<unknown> | null

	deselectExistingAction(from: Player, message: Message): Promise<void>
}

const isRemovableAction = (object: any): object is RemovableAction => {
	return "getExistingAction" in object && "deselectExistingAction" in object
}

export const deselectExistingActions = async (from: Player, message: Message): Promise<void> => {
	const promises: Promise<void>[] = []
	for (const part of from.role.allParts) {
		if (!isRemovableAction(part)) {
			continue
		}
		if (part.getExistingAction(from)) {
			promises.push(part.deselectExistingAction(from, message))
		}
	}
	await Promise.all(promises)
}
