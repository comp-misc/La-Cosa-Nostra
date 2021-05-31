import { UnaffiliatedCommand } from "../CommandType"

const notify: UnaffiliatedCommand = async (message, params, config) => {
	const member = message.member

	if (params.length < 1) {
		await message.channel.send(
			":x: Wrong syntax! Try using `" + config["command-prefix"] + "notify <on/off>` instead!"
		)
		return
	}

	const role = message.member.guild.roles.cache.find((x) => x.name === config.permissions.notify)
	if (!role) {
		throw new Error("No role found with name 'config.permissions.notify'")
	}

	const has_role = member.roles.cache.some((x) => x.id === role.id)

	switch (params[0].toLowerCase()) {
		case "on":
			if (has_role) {
				await message.channel.send(":x: You already have the notification role!")
				return
			}

			await member.roles.add(role)
			await message.channel.send(
				":exclamation: Successfully added the notification role. Use `" +
					config["command-prefix"] +
					"notify off` to remove it."
			)
			break

		case "off":
			if (!has_role) {
				await message.channel.send(":x: You do not have the notification role!")
				return
			}

			await member.roles.remove(role)
			await message.channel.send(
				":exclamation: Successfully removed the notification role. Use `" +
					config["command-prefix"] +
					"notify on` to add it again."
			)
			break

		default:
			await message.channel.send(
				":x: Wrong syntax! Try using `" + config["command-prefix"] + "notify <on/off>` instead!"
			)
			return
	}
}

export default notify
