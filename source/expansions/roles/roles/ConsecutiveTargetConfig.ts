import { Message } from "discord.js"
import createTargetCommand, { TargetCommand, TargetRoleCommand } from "../../../commands/createTargetCommand"
import Game from "../../../systems/game_templates/Game"
import Player from "../../../systems/game_templates/Player"
import { ProgrammableRole } from "../../../systems/Role"

export default interface ConsecutiveTargetConfig {
	/**
	 * The number of nights the role has to wait to be able to use their action on the same player again.
	 * 0 => No cooldown, can target the same player on consecutive nights
	 * 1 => Only can target the same player on non-consecutive nights
	 */
	sameTargetCooldown: number
}

const getCooldownDescription = (config: ConsecutiveTargetConfig): string => {
	switch (config.sameTargetCooldown) {
		case 0:
			return ""
		case 1:
			return ", however you may not target the same player on consecutive nights"
		default:
			return `, however you can only target the same player again after ${config.sameTargetCooldown} nights`
	}
}

export const formatConsecutiveRoleDescription = (description: string, config: ConsecutiveTargetConfig): string => {
	return description.replace("${cooldownDescription}", getCooldownDescription(config))
}

export const validateCanUseSameAction = async (
	player: Player,
	target: Player,
	message: Message,
	previousTargetsKey: string,
	actionVerb: string
): Promise<boolean> => {
	const { sameTargetCooldown: targetCooldown } = (player.role.role as ProgrammableRole<ConsecutiveTargetConfig>)
		.config
	const previousTargets = player.misc[previousTargetsKey] as string[]
	for (let i = 0; i < targetCooldown && i < previousTargets.length - 1; i++) {
		//First entry = currently targeting player
		if (previousTargets[previousTargets.length - i - 2] === target.identifier) {
			if (targetCooldown === 1) {
				await message.reply(`:x: You cannot ${actionVerb} on the same player on two consecutive nights!`)
			} else {
				const nightsToWait = targetCooldown - i
				if (nightsToWait === 1) {
					await message.reply(`:x: You must wait 1 more night to ${actionVerb} that player!`)
				} else {
					await message.reply(`:x: You must wait ${nightsToWait} more nights to ${actionVerb} that player!`)
				}
			}
			return false
		}
	}
	return true
}

export const setCurrentTarget = (player: Player, target: Player | null, previousTargetKey: string): void => {
	const targets = player.misc[previousTargetKey] as (string | null)[]
	targets[targets.length - 1] = target ? target.identifier : null
}

export const consecutiveTargetRoutines = (player: Player, previousTargetKey: string): void => {
	const targets = player.misc[previousTargetKey] as (string | null)[]
	targets.push(null)
}

export const createBasicConsecutiveRoleCommand = (data: {
	deleteAction: (game: Game, from: Player, target: Player | "nobody") => void
	addAction: (game: Game, from: Player, target: Player) => Promise<void>
	onNoAction?: (game: Game, from: Player) => void | Promise<void>
	previousTargetsKey: string
	actionVerb: string
	emoji: string
	commandName: string
	commandDescription: string
}): TargetCommand => {
	const {
		deleteAction,
		onNoAction,
		addAction,
		previousTargetsKey,
		actionVerb,
		emoji,
		commandName,
		commandDescription,
	} = data
	const cmd: TargetRoleCommand = async (game, message, target, from) => {
		if (target === "nobody") {
			deleteAction(game, from, target)
			setCurrentTarget(from, null, previousTargetsKey)
			await message.reply(`${emoji} You have decided not to ${actionVerb} anyone tonight.`)
			if (onNoAction) {
				await onNoAction(game, from)
			}
			return
		}

		if (!(await validateCanUseSameAction(from, target, message, previousTargetsKey, actionVerb))) {
			return
		}

		deleteAction(game, from, target)
		await setCurrentTarget(from, target, previousTargetsKey)
		await addAction(game, from, target)

		await message.reply(`${emoji} You have decided to ${actionVerb} **${target.getDisplayName()}** tonight.`)
	}
	cmd.PRIVATE_ONLY = true
	cmd.DEAD_CANNOT_USE = true
	cmd.ALIVE_CANNOT_USE = false
	cmd.DISALLOW_DAY = true
	cmd.DISALLOW_NIGHT = false

	return createTargetCommand(cmd, {
		name: commandName,
		description: commandDescription,
	})
}
