// Forced sudo execution

import { AdminCommand } from "../CommandType"

const _fsudo: AdminCommand = async (message, params) => {
	const client = message.client
	if (params.length === 0) {
		await message.reply(":exclamation: Must specify a player")
		return
	}

	const user = client.users.cache.get(params[0]) || {
		id: params[0],
		username: "undef'd player",
		bot: false,
	}
	const member = message.guild.members.cache.get(params[0]) || {
		id: params[0],
		user: user,
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

export = _fsudo
