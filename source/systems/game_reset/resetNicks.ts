import { Client } from "discord.js"
import getGuild from "../../getGuild"

const resetNicks = async (client: Client): Promise<void> => {
	const guild = getGuild(client)
	const members = guild.members.array()

	// Remove all nickname prefixes

	for (let i = 0; i < members.length; i++) {
		let name = members[i].displayName

		name = name.replace(new RegExp("^([[A-z|0-9]{1,2}] )*", "g"), "")

		if (name !== members[i].displayName) {
			await members[i].setNickname(name)
		}
	}
}

export = resetNicks
