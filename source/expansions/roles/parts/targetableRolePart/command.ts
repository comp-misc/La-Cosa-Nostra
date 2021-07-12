import { Message } from "discord.js"
import { CommandProperties, CommandUsageError, RoleCommand } from "../../../../commands/CommandType"
import { Actionable, ActionOptions } from "../../../../systems/game_templates/Actions"
import Game from "../../../../systems/game_templates/Game"
import Player from "../../../../systems/game_templates/Player"
import { ITargetableRolePart, TargetableRoleConfig, TargetableRoleState } from "./types"

export interface TargetableRoleCommand {
	command: {
		name: string
		description: string
		emoji: string
		aliases?: string[]
	}
	actionVerb: string
	getCurrentAction: (game: Game, from: Player) => Actionable<unknown> | null
	deselectCurrentAction: (game: Game, message: Message, from: Player) => Promise<void>
	onNoAction: (game: Game, message: Message, from: Player) => Promise<void>
	onAction: (game: Game, message: Message, from: Player, target: Player) => Promise<void>
	preValidation?: (game: Game, message: Message, params: string[], player: Player) => boolean | Promise<boolean>
}

const validateCanUseSameAction = async <T extends TargetableRoleConfig, S extends TargetableRoleState>(
	target: Player,
	message: Message,
	role: ITargetableRolePart<T, S>
): Promise<boolean> => {
	const previousTargets = role.targets
	const targetCooldown = role.sameTargetCooldown

	if (!Number.isFinite(targetCooldown)) {
		return true
	}
	for (let i = 0; i < targetCooldown && i < previousTargets.length - 1; i++) {
		//First entry = currently targeting player
		if (previousTargets[previousTargets.length - i - 2] === target.identifier) {
			await message.reply(`:x: ${role.formatCooldown()}!`)
			return false
		}
	}
	return true
}

export const sendDefaultActionMessage = async (
	emoji: string,
	verb: string,
	from: Player,
	target: Player,
	message: Message
): Promise<void> => {
	await message.reply(`:${emoji}: You have decided to ${verb} **${target.getDisplayName()}** tonight.`)
	await from.broadcastTargetMessage(
		`:${emoji}: **${from.getDisplayName()}** has decided to ${verb} **${target.getDisplayName()}** tonight.`
	)
}

export const sendDefaultDeselectMessage = async (
	emoji: string,
	description: string,
	from: Player,
	message: Message
): Promise<void> => {
	await message.reply(`:${emoji}: Your ${description} action has been **deselected**`)
	await from.broadcastTargetMessage(
		`:${emoji}: **${from.getDisplayName()}'s** ${description} action has been deselected`
	)
}

export const sendDefaultNoActionMessage = async (
	emoji: string,
	verb: string,
	from: Player,
	message: Message
): Promise<void> => {
	await message.reply(`${emoji} You have decided not to ${verb} anyone tonight.`)
	await from.broadcastTargetMessage(
		`:${emoji}: **${from.getDisplayName()}** has decided not to ${verb} anyone tonight`
	)
}

export const createBasicTargetableCommand = <T>(data: {
	command: {
		name: string
		description: string
		emoji: string
		aliases?: string[]
	}
	actionId: string
	actionVerb: string
	getActionOptions: (game: Game, from: Player, target: Player) => ActionOptions<T>
}): TargetableRoleCommand => {
	const { command, actionId, actionVerb, getActionOptions } = data
	const { emoji } = command

	const deleteActions = (game: Game, from: Player): boolean => {
		const deleted = game.actions.delete((x) => x.from === from.identifier && x.identifier === actionId)
		return deleted.length > 0
	}

	return {
		actionVerb,
		command,
		getCurrentAction: (game, from) => {
			return game.actions.find((x) => x.from === from.identifier && x.identifier === actionId)
		},
		onNoAction: async (game, message, from) => {
			deleteActions(game, from)
			await sendDefaultNoActionMessage(emoji, actionVerb, from, message)
		},
		onAction: async (game, message, from, target) => {
			deleteActions(game, from)
			await game.addAction(actionId, ["cycle"], getActionOptions(game, from, target))
			await sendDefaultActionMessage(emoji, actionVerb, from, target, message)
		},
		deselectCurrentAction: async (game, message, from) => {
			if (deleteActions(game, from)) {
				await sendDefaultDeselectMessage(emoji, actionVerb, from, message)
			}
		},
	}
}

export const createRealCommand = <T extends TargetableRoleConfig, S extends TargetableRoleState>(
	command: TargetableRoleCommand,
	role: ITargetableRolePart<T, S>
): CommandProperties<RoleCommand> => {
	const {
		command: { name, description, aliases },
		preValidation,
		onNoAction,
		onAction,
	} = command

	const roleCmd: RoleCommand = async (game, message, params, player) => {
		if (preValidation && !(await preValidation(game, message, params, player))) {
			return
		}
		if (params.length === 0) {
			throw new CommandUsageError()
		}
		const playerName = params.join(" ")
		if (playerName.toLowerCase() === "nobody") {
			const targets = role.targets
			targets[targets.length - 1] = null
			await onNoAction(game, message, player)
			return
		}
		const playerMatch = game.getPlayerMatch(playerName)
		if (playerMatch.score < 0.7) {
			await message.reply(":x: Unknown player")
			return
		}
		const to = playerMatch.player
		if (!to.isAlive()) {
			await message.reply(":x: You can't use your ability on a dead player!")
			return
		}
		if (player === to) {
			await message.reply("You can't use your ability on yourself!")
			return
		}
		if (!(await validateCanUseSameAction(to, message, role))) {
			return
		}
		const targets = role.targets
		targets[targets.length - 1] = to.identifier

		await onAction(game, message, player, to)
	}

	roleCmd.ALIVE_CANNOT_USE = false
	roleCmd.DEAD_CANNOT_USE = true
	roleCmd.DISALLOW_DAY = false
	roleCmd.DISALLOW_NIGHT = false
	roleCmd.PRIVATE_ONLY = true

	return {
		name,
		description,
		usage: name + " <player | nobody>",
		aliases,
		command: roleCmd,
	}
}
