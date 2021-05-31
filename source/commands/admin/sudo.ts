// Forced command execution

import { AdminCommand } from "../CommandType"

const sudo: AdminCommand = async (message, params) => {
	const client = message.client

	const user = client.users.fetch(params[0])
	const member = await message.guild.members.fetch(params[0])

	if (!member) {
		await message.channel.send(":x: That user has an invalid ID and cannot be sudo'd.")
		return
	}

	// Creates a "proto" object

	const clone = Object.assign({}, message)

	Object.defineProperty(clone, "author", { value: user, writable: true })
	Object.defineProperty(clone, "member", { value: member, writable: true })
	Object.defineProperty(clone, "content", { value: params.splice(1, Infinity).join(" "), writable: true })
	Object.defineProperty(clone, "client", { value: client, writable: true })
	Object.defineProperty(clone, "artificial", { value: "true", writable: false })

	client.emit("message", clone)
}

export default sudo
