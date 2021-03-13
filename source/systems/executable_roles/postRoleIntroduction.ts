import Discord from "discord.js"
import delay from "../../auxils/delay"
import pinMessage from "../executable_misc/pinMessage"
import Player from "../game_templates/Player"

const cpl = (string: string): string => {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

export = async (player: Player, stagger = 400): Promise<void> => {
	const game = player.getGame()

	const flavour = game.getGameFlavour()

	const flavours = flavour?.flavours
	const flavour_role = flavours && player.flavour_role ? flavours[player.flavour_role] : undefined

	const flavour_info = flavour?.info || {
		"show-role-equivalent": false,
		"show-vanilla-banner": true,
		"show-role-category": true,
	}

	// Staggering prevents overload
	await delay(Math.random() * stagger * game.players.length)

	const role = player.role
	if (!role) {
		throw new Error(`No role set for player ${player.getDisplayName()}`)
	}

	const channel = player.getPrivateChannel()
	if (flavour_role?.banner && flavour && flavour.assets[flavour_role.banner]) {
		// Flavour role card available
		const attachment = new Discord.Attachment(flavour.assets[flavour_role.banner], "role_card.png")

		// Post
		const message = await channel.send(undefined, attachment)
		await pinMessage(message)
	}

	if (role.role_card && flavour_info["show-vanilla-banner"]) {
		// Role card available
		const attachment = new Discord.Attachment(await role.role_card, "role_card.png")

		// Post
		const message = await channel.send(undefined, attachment)
		await pinMessage(message)
	}

	let send =
		"**Your role:** {;role}{;true_role}\n\n**Alignment:** {;alignment}\n\n```fix\n{;description}```\n<@{;player_id}>"

	send = send.replace(/{;role}/g, cpl(flavour_role?.name || role["role-name"]))

	if (flavour_info["show-role-category"] === false) {
		send = send.replace(/{;alignment}/g, cpl(role.alignment))
	} else {
		send = send.replace(/{;alignment}/g, cpl(role.alignment + "-" + cpl(role.class)))
	}

	send = send.replace(
		/{;description}/g,
		(flavour_role ? flavour_role["secondary-description"] : undefined) || flavour_role?.description || role.description
	)
	send = send.replace(/{;player_id}/g, player.id)

	if (flavour && flavour_info["show-role-equivalent"] && flavour_role?.name !== role["role-name"]) {
		send = send.replace(/{;true_role}/g, "\n\n**Vanilla role equivalent:** " + role["role-name"])
	} else {
		send = send.replace(/{;true_role}/g, "")
	}

	const message = await channel.send(send)
	await pinMessage(message)

	const start_message = await channel.send(
		"~~                                              ~~    **" + game.getFormattedDay() + "**         [*game start*]"
	)
	await pinMessage(start_message)

	for (let i = 0; i < player.intro_messages.length; i++) {
		await channel.send(player.intro_messages[i])
	}

	player.intro_messages = []
}
