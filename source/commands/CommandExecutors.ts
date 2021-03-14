import { Message } from "discord.js"
import getLogger from "../getLogger"
import { getTimer, hasTimer } from "../getTimer"
import { LcnConfig } from "../LcnConfig"
import MemberMessage from "../MemberMessage"
import { AdminCommand, CommandProperties, GameCommand, RoleCommand } from "./CommandType"

export const executeAdminCommand = async (
	command: CommandProperties<AdminCommand>,
	message: MemberMessage,
	params: string[],
	config: LcnConfig
): Promise<void> => {
	const member = message.member
	const logger = getLogger()

	if (!member.roles.cache.some((x) => x.name === config.permissions.admin)) {
		logger.log(
			1,
			`User ${member.id} [${member.user.username}#${member.user.discriminator}] failed to run admin-type command (due to lack of permissions) "${command.name}".`
		)
		await message.reply(":x: You do not have sufficient permissions to use this command!")
		return
	}
	logger.log(
		2,
		`User ${member.id} [${member.user.username}#${member.user.discriminator}] ran admin-type command "${command.name}".`
	)
	await command.command(message, params, config)
}

export const executeGameCommand = async (
	command: CommandProperties<GameCommand>,
	message: MemberMessage,
	params: string[]
): Promise<void> => {
	if (!hasTimer()) {
		await message.reply(":x: There is no game in progress!")
		return
	}
	const game = getTimer().game
	if (game.state === "pre-game" && command.command.ALLOW_PREGAME === false) {
		await message.reply(":x: That command cannot be used in the pre-game!")
		return
	}
	if (game.state === "playing" && command.command.ALLOW_GAME === false) {
		message.reply(":x: That command cannot be used when the game is running!")
		return
	}
	if (game.state === "ended" && command.command.ALLOW_POSTGAME === false) {
		message.reply(":x: That command cannot be used in the post-game!")
		return
	}
	await command.command(game, message, params)
}

export const executeRoleCommand = async (
	command: CommandProperties<RoleCommand>,
	message: MemberMessage,
	params: string[]
): Promise<void> => {
	if (!hasTimer()) {
		await message.reply(":x: There is no game in progress!")
		return
	}
	const game = getTimer().game
	const player = game.getPlayerById(message.author.id)
	if (!player) {
		await message.reply(":x: You are not in the game")
		return
	}
	const conditions: {
		property: keyof RoleCommand
		message: string
		condition: (value: boolean) => boolean
		default: boolean
	}[] = [
		{
			property: "ALLOW_NONSPECIFIC",
			message: "You cannot use this command",
			condition: (value) =>
				!value &&
				command.command.role !== undefined &&
				player.role_identifier.toLowerCase() !== command.command.role.toLowerCase(),
			default: false,
		},
		{
			property: "PRIVATE_ONLY",
			message: "You cannot use this command here",
			condition: (value) => value && message.channel.id !== player.channel?.id,
			default: true,
		},
		{
			property: "DISALLOW_DAY",
			message: "That command cannot be used during the day!",
			condition: (value) => value && game.isDay(),
			default: true,
		},
		{
			property: "DISALLOW_NIGHT",
			message: "That command cannot be used during the night!",
			condition: (value) => value && !game.isDay(),
			default: true,
		},
		{
			property: "DEAD_CANNOT_USE",
			message: "This command cannot be used by the dead!",
			condition: (value) => value && !player.status.alive,
			default: true,
		},
		{
			property: "ALIVE_CANNOT_USE",
			message: "This command cannot be used by the living!",
			condition: (value) => value && player.status.alive,
			default: true,
		},
	]

	const failure = conditions.find((condition) => {
		let value = command.command[condition.property] as boolean
		if (value === undefined) {
			value = condition.default
		}
		return condition.condition(value)
	})
	if (failure) {
		await message.reply(":x: " + failure.message)
		return
	}
	await command.command(game, message, params, player)
}
