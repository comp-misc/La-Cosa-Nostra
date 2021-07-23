import filterDefined from "../../../../../auxils/filterDefined"
import { RoleActionable } from "../../../../../systems/actionables"
import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"

const interrogate: RoleActionable = async (actionable, game) => {
	const from = game.getPlayerOrThrow(actionable.from)
	const target = game.getPlayerOrThrow(actionable.to)

	await game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Interrogator-interrogate",
		type: "interrogate",
	})

	game.addMessage(target, `:exclamation: **${from.getDisplayName()}** brought you up to an interrogation.`)

	const postPerms = game.config["base-perms"].post
	const perms = filterDefined([from, target].map((p) => p.getGuildMember())).map((user) => ({
		target: user,
		permissions: postPerms,
	}))

	const channel = await game.createPrivateChannel(
		`interrogation-${from.alphabet}-${target.alphabet}`,
		perms,
		"Interrogation"
	)
	await channel.send("**This is the interrogation chat.**")

	from.addSpecialChannel(channel)
	target.addSpecialChannel(channel)

	await game.addAction("interrogator/close_chat", ["cycle"], {
		name: "Interrogator-close-chat",
		expiry: 2,
		execution: 2,
		from: from,
		to: target,
		priority: ActionPriorities.HIGHEST,
		meta: {
			channelId: channel.id,
		},
	})
}
interrogate.TAGS = ["drivable", "roleblockable"]

export default interrogate
