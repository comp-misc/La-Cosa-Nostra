import { hasTimer, getTimer } from "../../getTimer"
import { AdminCommand } from "../CommandType"

const resurrect: AdminCommand = async (message, params) => {
	if (!hasTimer() || !["pre-game", "playing"].includes(getTimer().game.state)) {
		await message.channel.send(":x: No game in progress.")
		return null
	}

	const game = getTimer().game
	const config = game.config

	if (params.length !== 1) {
		await message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "resurrect <id>` instead!")
		return
	}

	const id = params[0]

	const player = game.getPlayerById(id)
	if (!player) {
		await message.channel.send(":x: Unable to find that player")
		return
	}

	if (player.isAlive()) {
		await message.channel.send(":x: That player is alive!")
		return
	}

	const alive_role = await game.getDiscordRoleOrThrow("alive")
	const dead_role = await game.getDiscordRoleOrThrow("dead")

	const member = player.getGuildMember()
	if (!member) {
		await message.channel.send(":x: That player is no longer on the discord server")
		return
	}

	await member.roles.add(alive_role)
	await member.roles.remove(dead_role)

	player.status.alive = true

	game.save()

	await message.channel.send(
		":ok: Revived player. Please manually ensure that they have access to the private channels."
	)
}

export = resurrect
