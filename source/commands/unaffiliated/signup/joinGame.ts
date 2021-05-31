import { CommandProperties, UnaffiliatedCommand } from "../../CommandType"
import createSignupCommand, {
	addRole,
	formatSignedUpPlayers,
	removeBackup,
	removeSpectator,
} from "../../createSignupCommand"

const command = createSignupCommand(async (msg, params, config) => {
	if (msg.member.roles.cache.some((r) => r.name === config.permissions.pre)) {
		await msg.reply(`:x:  You are already in the game!`)
		return
	}

	await removeSpectator(msg.member, config)
	await removeBackup(msg.member, config)
	await addRole("pre", msg.member, config)

	const format = formatSignedUpPlayers(msg.guild, config)
	await msg.channel.send(
		`:white_check_mark:  ~~    ~~  **${msg.member.user.tag}** has signed up to __play__! ${format}`
	)
})

const join: CommandProperties<UnaffiliatedCommand> = {
	name: "join",
	aliases: ["j", "jgame", "play", "joingame", "signup"],
	description: "Signs you up to join the next game",
	command,
}

export default join
