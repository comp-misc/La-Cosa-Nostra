import Discord from "discord.js"
import Game from "../../game_templates/Game"
import Player from "../../game_templates/Player"

const cpl = (string: string): string => {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

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

		await roles_channel.send(undefined, attachment)

		let sendable = "**{;flavour_role}**: {;info}\n```fix\n{;description}```"

		sendable = sendable.replace(/{;flavour_role}/g, player.role.getName(false))

		let info = ""

		if (flavour.info["display-role-equivalent-on-death"]) {
			info += (player.role.role.displayName || player.role.properties["role-name"]) + "-equivalent; "
		}

		info += cpl(player.role.properties.alignment)

		if (flavour.info["show-role-category"]) {
			info += "-" + cpl(player.role.properties.class)
		}

		sendable = sendable.replace(/{;info}/g, info)
		sendable = sendable.replace(/{;description}/g, player.role.description)

		await roles_channel.send(sendable)
	}
}

export default uploadPublicRoleInformation
