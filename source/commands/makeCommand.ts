import { CommandProperties } from "./CommandType"

const makeCommand = <T>(command: T, properties: Omit<CommandProperties<T>, "command">): CommandProperties<T> => ({
	...properties,
	command,
})

export default makeCommand
