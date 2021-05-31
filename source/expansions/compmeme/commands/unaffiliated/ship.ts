import { CommandUsageError, UnaffiliatedCommand } from "../../../../commands/CommandType"
import { formatMessage } from "../createCommands"
import makeCommand from "../../../../commands/makeCommand"

const ship: UnaffiliatedCommand = async (message, params) => {
	if (params.length !== 2) {
		throw new CommandUsageError()
	}
	const msg = formatMessage(
		message,
		[
			"%sender% ships %other1% and %other2%",
			"%other1% and %other2% sitting in a tree...",
			":heart: %sender% thinks %other1% and %other2% are a cute couple ",
		],
		{
			other1: params[0],
			other2: params[1],
		}
	)
	await message.channel.send(msg)
}

export default makeCommand(ship, {
	name: "ship",
	usage: "!ship <who> <with>",
	description: "Ship a cute couple :heart:",
})
