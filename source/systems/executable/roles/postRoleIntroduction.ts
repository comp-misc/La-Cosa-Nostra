import Discord, { BufferResolvable } from "discord.js"
import delay from "../../../auxils/delay"
import Player from "../../game_templates/Player"
import pinMessage from "../misc/pinMessage"
import { FlavourData, FlavourRoleData } from "../../flavours"
import { ExpandedRole } from "./getRole"
import { loadImage } from "canvas"
import getAsset from "../../../auxils/getAsset"
import generateRoleCard from "./generateRoleCard"

const cpl = (string: string): string => {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

const getRoleCard = async (
	flavour_role: FlavourRoleData | undefined,
	flavour: FlavourData | null,
	role: ExpandedRole
): Promise<BufferResolvable> => {
	if (flavour_role?.banner && flavour && flavour.assets[flavour_role.banner]) {
		return Promise.resolve(flavour.assets[flavour_role.banner])
	} else if (role.card) {
		return role.card
	} else {
		//Generate role card
		const alignmentImage = await loadImage(getAsset(role.alignment + ".png").data)
		return generateRoleCard(role["role-name"], alignmentImage)
	}
}

export = async (player: Player, stagger = 400): Promise<void> => {
	const game = player.getGame()

	const flavour = game.getGameFlavour()

	const flavours = flavour?.flavours
	const flavour_role = flavours && player.flavour_role ? flavours[player.flavour_role] : undefined

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

	const card = getRoleCard(flavour_role, flavour, role)
	const attachment = new Discord.MessageAttachment(await card, "role_card.png")
	const attachmentMessage = await channel.send(undefined, attachment)
	await pinMessage(attachmentMessage)

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
		(flavour_role ? flavour_role["secondary-description"] : undefined) ||
			flavour_role?.description ||
			role.description
	)
	send = send.replaceAll("${game.name}", game.config.messages.name)
	send = send.replace(/{;player_id}/g, player.id)

	if (flavour && flavour_info["show-role-equivalent"] && flavour_role?.name !== role["role-name"]) {
		send = send.replace(/{;true_role}/g, "\n\n**Vanilla role equivalent:** " + role["role-name"])
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
