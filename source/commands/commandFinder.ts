import { Command } from "./CommandType"

export const findCommand = (
	commands: Command[],
	commandName: string,
	filter?: (command: Command) => boolean
): Command | null => {
	const eligableCommands = filter ? commands.filter(filter) : commands
	return (
		eligableCommands.find((cmd) => cmd.name === commandName) ||
		eligableCommands.find((cmd) => cmd.name.toLowerCase() === commandName.toLowerCase()) ||
		eligableCommands.find((cmd) => cmd.aliases?.includes(commandName)) ||
		eligableCommands.find((cmd) => cmd?.aliases?.map((a) => a.toLowerCase())?.includes(commandName.toLowerCase())) ||
		null
	)
}
