import { CommandProperties, UnaffiliatedCommand } from "../../CommandType"
import createSignupCommand, { addRole, removePlayer, removeSpectator } from "../../createSignupCommand"

const command = createSignupCommand(async (msg, params, config) => {
	if (msg.member.roles.cache.some((r) => r.name === config.permissions.backup)) {
		await msg.reply(`:x:  You are already a backup!`)
		return
	}
	await removeSpectator(msg.member, config)
	await removePlayer(msg.member, config)
	await addRole("backup", msg.member, config)

	await msg.channel.send(
		":ballot_box_with_check:  ~~    ~~  **" + msg.member.user.tag + "** has signed up as a __backup__!"
	)
})

const backup: CommandProperties<UnaffiliatedCommand> = {
	name: "backup",
	description: "Sets you to be a backup player",
	command,
}

export = backup
