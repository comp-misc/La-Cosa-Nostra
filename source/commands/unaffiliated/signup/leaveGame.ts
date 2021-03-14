import { CommandProperties, UnaffiliatedCommand } from "../../CommandType"
import createSignupCommand, { removePlayer } from "../../createSignupCommand"

const command = createSignupCommand(async (msg, params, config) => {
	if (!msg.member.roles.cache.some((r) => r.name === config.permissions.pre)) {
		await msg.reply(`:x:  You can't leave a game you never joined!`)
		return
	}
	await removePlayer(msg.member, config)
})

const unspectate: CommandProperties<UnaffiliatedCommand> = {
	name: "leave",
	aliases: ["leavegame", "lgame"],
	description: "Removes you from the current game /signup",
	command,
}

export = unspectate
