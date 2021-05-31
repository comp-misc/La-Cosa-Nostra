import { CommandProperties, UnaffiliatedCommand } from "../../CommandType"
import createSignupCommand, { addRole, removeBackup, removePlayer } from "../../createSignupCommand"

const command = createSignupCommand(async (msg, params, config) => {
	if (msg.member.roles.cache.some((r) => r.name === config.permissions.spectator)) {
		await msg.reply(`:x:  You are already spectating the game!`)
		return
	}
	await removeBackup(msg.member, config)
	await removePlayer(msg.member, config)
	await addRole("spectator", msg.member, config)

	await msg.channel.send(
		":crystal_ball:  ~~    ~~  **" + msg.member.user.tag + "** is choosing to __spectate__ the game!"
	)
})

const spectate: CommandProperties<UnaffiliatedCommand> = {
	name: "spectate",
	aliases: ["spec"],
	description: "Allows you to spectate the current game",
	command,
}

export default spectate
