import formatEmoji from "../../../../auxils/formatEmoji"
import { UnaffiliatedCommand } from "../../../../commands/CommandType"
import { formatMessage } from "../createCommands"
import makeCommand from "../../../../commands/makeCommand"

const dab: UnaffiliatedCommand = async (message, params, config) => {
	const dabEmoji = config.emoji.dab
	const msg = formatMessage(message, [formatEmoji(dabEmoji) + " %sender% just dabbed!"])
	await message.channel.send(msg)
}

export default makeCommand(dab, {
	name: "dab",
	description: "When you just gotta dab",
	usage: "!dab",
})
