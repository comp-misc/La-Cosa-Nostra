import Discord from "discord.js"
import delay from "../../../auxils/delay"
import Player from "../../game_templates/Player"
import pinMessage from "../misc/pinMessage"

const cpl = (string: string): string => {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

export default async (player: Player, stagger = 400): Promise<void> => {
	const game = player.getGame()

	const flavour = game.getGameFlavour()
	const flavour_info = flavour?.info || {
		"show-role-equivalent": false,
		"show-role-category": true,
	}

	// Staggering prevents overload
	await delay(Math.random() * stagger * game.players.length)

	const role = player.role
	if (!role) {
		throw new Error(`No role set for player ${player.getDisplayName()}`)
	}

	const channel = player.getPrivateChannel()

	const attachment = new Discord.MessageAttachment(await role.createRoleCard(), "role_card.png")
	const attachmentMessage = await channel.send(undefined, attachment)
	await pinMessage(attachmentMessage)

	let send =
		"**Your role:** {;role}{;true_role}\n\n**Alignment:** {;alignment}\n\n```fix\n{;description}```\n<@{;player_id}>"

	send = send.replace(/{;role}/g, cpl(role.getDisplayName()))

	if (flavour_info["show-role-category"] === false) {
		send = send.replace(/{;alignment}/g, cpl(role.properties.alignment))
	} else {
		send = send.replace(/{;alignment}/g, cpl(role.properties.alignment + "-" + cpl(role.properties.class)))
	}

	send = send.replace(/{;description}/g, role.description)
	send = send.replace(/{;player_id}/g, player.id)

	const basicDisplayName = role.role.displayName || role.properties["role-name"]
	if (flavour && flavour_info["show-role-equivalent"] && basicDisplayName !== role.getDisplayName()) {
		send = send.replace(/{;true_role}/g, "\n\n**Vanilla role equivalent:** " + basicDisplayName)
	} else {
		send = send.replace(/{;true_role}/g, "")
	}

	const message = await channel.send(send)
	await pinMessage(message)

	const start_message = await channel.send(
		"~~                                              ~~    **" +
			game.getFormattedDay() +
			"**         [*game start*]"
	)
	await pinMessage(start_message)

	for (let i = 0; i < player.intro_messages.length; i++) {
		await channel.send(player.intro_messages[i])
	}

	player.intro_messages = []
}
