import Discord from "discord.js"
import delay from "../../../auxils/delay"
import { formatAlignment } from "../../../role"
import Player from "../../game_templates/Player"
import pinMessage from "../misc/pinMessage"

const cpl = (string: string): string => {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

export default async (player: Player, stagger = 400): Promise<void> => {
	const game = player.getGame()

	const flavour = game.getGameFlavour()

	// Staggering prevents overload
	await delay(Math.random() * stagger * game.players.length)

	const role = player.role
	if (!role) {
		throw new Error(`No role set for player ${player.getDisplayName()}`)
	}

	const channel = player.getPrivateChannel()

	const name = role.getName(!!flavour && flavour.info["show-role-equivalent"])
	player.initialRoleName = role.getDeathName()

	const attachment = new Discord.MessageAttachment(await role.createRoleCard(), "role_card.png")
	const attachmentMessage = await channel.send(
		`**Your role:** ${cpl(name)}\n**Alignment:** ` + formatAlignment(player.role.properties.alignment),
		attachment
	)

	const message = await channel.send(`${role.getDescription()}\n<@${player.id}>`)

	const start_message = await channel.send(
		"~~                                              ~~    **" +
			game.getFormattedDay() +
			"**         [*game start*]"
	)

	await pinMessage(attachmentMessage)
	await pinMessage(message)
	await pinMessage(start_message)

	for (let i = 0; i < player.intro_messages.length; i++) {
		await channel.send(player.intro_messages[i])
	}

	player.intro_messages = []
}
