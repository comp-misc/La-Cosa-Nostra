import { Channel, GuildMember } from "discord.js"
import getCommands from "."
import { getTimer, hasTimer } from "../getTimer"
import { Command, CommandType, RoleCommand } from "./CommandType"

export const getRoleCommandsFor = (member: GuildMember, channel: Channel): CommandType<"role", RoleCommand>[] => {
	if (!hasTimer()) {
		return []
	}
	const game = getTimer().game
	const player = game.getPlayerById(member.id)
	if (!player) {
		return []
	}
	const validCommands = player.role.role.commands.filter(({ command }) => {
		const { PRIVATE_ONLY, attribute } = command
		if (attribute && !player.hasAttribute(attribute)) {
			return false
		}
		if (PRIVATE_ONLY && channel.id !== player.channel?.id) {
			return false
		}
		return true
	})
	return validCommands.map((cmd) => ({
		...cmd,
		type: "role",
	}))
}

export const filterAttributeCommands = (commands: Command[], member: GuildMember, channel: Channel): Command[] =>
	commands.filter((cmd) => {
		if (cmd.type !== "role") return true
		if (!hasTimer()) return false
		const game = getTimer().game
		const player = game.getPlayerById(member.id)
		if (!player) {
			return false
		}
		if (cmd.command.PRIVATE_ONLY && channel.id !== player.channel?.id) {
			return false
		}
		if (cmd.command.attribute && !player.hasAttribute(cmd.command.attribute)) {
			return false
		}
		return true
	})

export const getVisibleCommands = (member: GuildMember, channel: Channel): Command[] => [
	...getRoleCommandsFor(member, channel),
	...filterAttributeCommands(getCommands(), member, channel),
]

export const findCommand = (
	commandName: string,
	member: GuildMember | null,
	channel: Channel | null,
	filter?: (command: Command) => boolean
): Command | null => {
	const validCommands = member && channel ? getVisibleCommands(member, channel) : getCommands()
	const eligibleCommands = filter ? validCommands.filter(filter) : validCommands

	return (
		eligibleCommands.find((cmd) => cmd.name === commandName) ||
		eligibleCommands.find((cmd) => cmd.name.toLowerCase() === commandName.toLowerCase()) ||
		eligibleCommands.find((cmd) => cmd.aliases?.includes(commandName)) ||
		eligibleCommands.find((cmd) =>
			cmd?.aliases?.map((a) => a.toLowerCase())?.includes(commandName.toLowerCase())
		) ||
		null
	)
}
