import { UnaffiliatedCommand } from "../../../../commands/CommandType"
import formatEmoji from "../../../../auxils/formatEmoji"
import makeCommand from "../../../../commands/makeCommand"

const skip: UnaffiliatedCommand = async (message, params, config) => {
	const who = params.join(" ").trim()
	if (who.length === 0) {
		await message.channel.send(
			formatEmoji(config.emoji["skip"]) + " **" + message.member.displayName + "** wants to get in a skip!"
		)
	} else {
		await message.channel.send(
			formatEmoji(config.emoji["skip"]) + " **" + who + "** get in the skip - " + message.member.displayName
		)
	}
}

export default makeCommand(skip, {
	name: "skip",
	description: "Get in the skip",
	usage: "!skip <who>",
})
