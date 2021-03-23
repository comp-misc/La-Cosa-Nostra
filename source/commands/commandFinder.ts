import { GuildChannel, GuildMember } from "discord.js"
import { getTimer, hasTimer } from "../getTimer"
import { Command, CommandProperties, RoleCommand } from "./CommandType"

export const isValidRoleCommandFor = (
	command: CommandProperties<RoleCommand>,
	member: GuildMember,
	channel: GuildChannel
): boolean => {
	if (!hasTimer()) {
		return false
	}
	const game = getTimer().game
	const player = game.getPlayerById(member.id)
	if (!player) {
		return false
	}
	const { ALLOW_NONSPECIFIC, PRIVATE_ONLY, role, attribute } = command.command
	if (
		!ALLOW_NONSPECIFIC &&
		((role !== undefined && player.role_identifier.toLowerCase() !== role.toLowerCase()) ||
			(attribute !== undefined && !player.hasAttribute(attribute)))
	) {
		return false
	}
	if (PRIVATE_ONLY && channel.id !== player.channel?.id) {
		return false
	}
	return true
}

export const findCommand = (
	commands: Command[],
	commandName: string,
	member: GuildMember | null,
	channel: GuildChannel | null,
	filter?: (command: Command) => boolean
): Command | null => {
	const eligibleCommands = (filter ? commands.filter(filter) : commands).filter(
		(cmd) =>
			!(cmd.type === "role" && (member == null || channel == null || !isValidRoleCommandFor(cmd, member, channel)))
	)
	return (
		eligibleCommands.find((cmd) => cmd.name === commandName) ||
		eligibleCommands.find((cmd) => cmd.name.toLowerCase() === commandName.toLowerCase()) ||
		eligibleCommands.find((cmd) => cmd.aliases?.includes(commandName)) ||
		eligibleCommands.find((cmd) => cmd?.aliases?.map((a) => a.toLowerCase())?.includes(commandName.toLowerCase())) ||
		null
	)
}
