import { Message } from "discord.js"
import auxils from "../../systems/auxils"
import { UnaffiliatedCommand } from "../CommandType"

const getLimit = (mode: string): number => {
	switch (mode) {
		case "pinpoint":
			return 1
		case "cluster":
			return 5
		case "context":
			return 20
	}
	return 5
}

const isolate: UnaffiliatedCommand = async (message, params, config) => {
	const channel = message.channel

	// Isolate

	if (params.length < 1) {
		await message.channel.send(
			":x: Wrong syntax! Please use `" +
				config["command-prefix"] +
				"isolate [pinpoint/cluster/context] <message ID>` instead!"
		)
		return
	}

	let mode = params[0].toLowerCase()
	let message_id: string
	if (!["pinpoint", "cluster", "context"].includes(mode)) {
		message_id = mode
		mode = "pinpoint"
	} else {
		message_id = params[1]
	}

	if (!/[0-9]{18}/g.test(message_id)) {
		await message.channel.send(
			":x: Wrong syntax! Please use `" +
				config["command-prefix"] +
				"isolate [pinpoint/cluster/context] <message ID>` instead!"
		)
		return
	}

	let messages: Message[]
	try {
		messages = (
			await channel.messages.fetch({
				limit: getLimit(mode),
				around: message_id,
			})
		).array()
	} catch (err) {
		await message.channel.send(
			":x: Invalid message ID! Please use `" +
				config["command-prefix"] +
				"isolate [pinpoint/cluster/context] <message ID>` to isolate a message!"
		)
		return
	}

	if (params[0] === "context") {
		// Filter contagion
		const index = messages.findIndex((x) => x.id === message_id)
		const author = messages[index].author.id

		let context = []

		for (let i = 0; i < messages.length; i++) {
			if (messages[i].author.id !== author) {
				if (i < index) {
					context = []
					continue
				} else {
					break
				}
			}

			context.push(messages[i])
		}

		messages = context
	}

	const formattedMessages = messages.map((x) => {
		const time = x.editedAt || x.createdAt
		const content = x.content.replace(/```/gm, "")
		const member = x.member

		const name = member ? member.displayName : x.author.id

		const addendum = x.id === message_id ? "(@) " : ""

		if (x.author.id === message.client.user?.id && content.includes("ISO for message")) {
			return "[" + auxils.formatUTCDate(time) + "] " + addendum + name + ": [bot ISO]"
		}

		return "[" + auxils.formatUTCDate(time) + "] " + addendum + name + ": " + content
	})

	if (formattedMessages.length < 1) {
		await message.channel.send(
			":x: Cannot find that message! Isolation only works for the channel the command is posted in."
		)
		await message.channel.stopTyping()
		return
	}

	formattedMessages.reverse()

	const sendable = formattedMessages.filter((x) => x !== null).join("\n\n")

	await message.channel.send("**ISO for message** `" + message_id + "`:```ini\n" + sendable + "```")
}

export default isolate
