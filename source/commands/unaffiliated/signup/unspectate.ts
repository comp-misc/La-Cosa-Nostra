import { CommandProperties, UnaffiliatedCommand } from "../../CommandType"
import createSignupCommand, { removeSpectator } from "../../createSignupCommand"

const command = createSignupCommand(async (msg, _params, config) => {
	if (!msg.member.roles.cache.some((r) => r.name === config.permissions.spectator)) {
		await msg.reply(`:x:  You are not already spectating the game!`)
		return
	}
	await removeSpectator(msg.member, config)
})

const unspectate: CommandProperties<UnaffiliatedCommand> = {
	name: "unspectate",
	aliases: ["unspec"],
	description: "Removes you from being able to spectate the game",
	command,
}

export default unspectate
