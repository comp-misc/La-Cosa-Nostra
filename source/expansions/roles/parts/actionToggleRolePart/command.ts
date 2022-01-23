import { Message } from "discord.js"
import { CommandProperties, CommandUsageError, RoleCommand } from "../../../../commands/CommandType"
import { Actionable, ActionOptions } from "../../../../systems/game_templates/Actions"
import Game from "../../../../systems/game_templates/Game"
import Player from "../../../../systems/game_templates/Player"
import { ActionToggleRoleConfig, ActionToggleRoleState, IActionToggleRolePart } from "./types"
import { sendDefaultDeselectMessage } from "../targetableRolePart/command"
import { deselectExistingActions } from "../RemovableAction"

export interface ActionToggleRoleCommand {
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
	onAction: (game: Game, message: Message, from: Player) => Promise<void>
	preValidation?: (game: Game, message: Message, params: string[], player: Player) => boolean | Promise<boolean>
}

const sendDefaultActionMessage = async (emoji: string, verb: string, from: Player, message: Message): Promise<void> => {
	await message.reply(`${emoji} You have decided to ${verb} tonight`)
	await from.broadcastTargetMessage(`${emoji} **${from.getDisplayName()}** has decided to ${verb} tonight`)
}

const sendDefaultNoActionMessage = async (
	emoji: string,
	verb: string,
	from: Player,
	message: Message
): Promise<void> => {
	await message.reply(`${emoji} You have decided not to ${verb} tonight.`)
	await from.broadcastTargetMessage(`${emoji} **${from.getDisplayName()}** has decided not to ${verb} tonight`)
}

export const createBasicActionToggleCommand = <T>(data: {
	command: {
		name: string
		description: string
		emoji: string
		aliases?: string[]
	}
	actionId: string
	actionVerb: string
	getActionOptions: (game: Game, from: Player) => ActionOptions<T>
}): ActionToggleRoleCommand => {
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
		onAction: async (game, message, from) => {
			deleteActions(game, from)
			await game.addAction(actionId, ["cycle"], getActionOptions(game, from))
			await sendDefaultActionMessage(emoji, actionVerb, from, message)
		},
		deselectCurrentAction: async (game, message, from) => {
			if (deleteActions(game, from)) {
				await sendDefaultDeselectMessage(emoji, actionVerb, from, message)
			}
		},
	}
}

export const createRealCommand = <T extends ActionToggleRoleConfig, S extends ActionToggleRoleState>(
	command: ActionToggleRoleCommand,
	role: IActionToggleRolePart<T, S>
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
		if (!role.canUseOnPeriod(game)) {
			await message.reply(`:x: You can only use this command ${role.formatPeriodDescription().toLowerCase()}`)
		}
		if (!role.hasRemainingShots()) {
			await message.reply(":x: You have no shots remaining!")
		}

		if (!params.length) {
			throw new CommandUsageError()
		}

		const rawAction = params.join(" ")
		const { periodsUsedAction } = role.state

		switch (rawAction.toLowerCase()) {
			case "on": {
				await deselectExistingActions(player, message, role)

				periodsUsedAction[periodsUsedAction.length - 1] = true
				await onAction(game, message, player)
				break
			}
			case "off": {
				periodsUsedAction[periodsUsedAction.length - 1] = false
				await onNoAction(game, message, player)
				break
			}
			default:
				throw new CommandUsageError(`Unknown action '${rawAction}'.`)
		}
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
