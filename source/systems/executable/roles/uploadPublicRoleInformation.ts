import Discord from "discord.js"
import { formatAlignment } from "../../../role"
import Game from "../../game_templates/Game"
import Player from "../../game_templates/Player"

const roleText = `
Role for **{;player}**:
Role: **{;role}**
Alignment: **{;alignment}**
`.trim()

const uploadPublicRoleInformation = async (game: Game, players: Player[]): Promise<void> => {
	// Open up simple chats
	const flavour = game.getGameFlavour()

	if (!flavour) {
		return
	}

	if (!flavour.info["post-role-card-and-description-on-death"]) {
		return
	}

	const roles_channel = game.getRolesChannel()

	for (const player of players) {
		const attachment = new Discord.MessageAttachment(await player.role.createRoleCard(), "role_card.png")

		let sendable = roleText.replace(/{;player}/g, player.getDisplayName())
		sendable = sendable.replace(/{;role}/g, player.role.getName(true))
		sendable = sendable.replace(/{;alignment}/g, formatAlignment(player.role.properties.alignment))

		await roles_channel.send(sendable, attachment)
		await roles_channel.send(player.role.getDescription())
	}
}

export default uploadPublicRoleInformation
