import { RoleActionable } from "../../../../../systems/actionables"

const closeChat: RoleActionable = async (actionable, game) => {
	const from = game.getPlayerOrThrow(actionable.from)
	const target = game.getPlayerOrThrow(actionable.to)

	const meta = actionable.meta as { channelId: string }

	const channel = game.getChannelById(meta.channelId)
	if (!channel) {
		return
	}

	await channel.send("**The Interrogation is now over.**")

	for (const player of [from, target]) {
		const member = player.getGuildMember()
		if (member) {
			await channel.createOverwrite(member, game.config["base-perms"].read, "Interrogation Over")
		}
	}
}

export default closeChat
