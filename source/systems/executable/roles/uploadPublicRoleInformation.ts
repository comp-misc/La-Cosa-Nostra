import Discord from "discord.js"
import getLogger from "../../../getLogger"
import Game from "../../game_templates/Game"
import Player from "../../game_templates/Player"

const cpl = (string: string): string => {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

const uploadPublicRoleInformation = async (game: Game, roles: Player[]): Promise<void> => {
	// Open up simple chats
	const flavour = game.getGameFlavour()

	if (!flavour) {
		return
	}

	const flavours = flavour.flavours

	if (!flavour.info["post-role-card-and-description-on-death"]) {
		return
	}

	const roles_channel = game.getRolesChannel()

	for (let i = 0; i < roles.length; i++) {
		const role = roles[i]
		const flavour_role = flavours[role.flavour_role || ""]
		if (!flavour_role) {
			getLogger().log(1, `No flavour found with role ${role.flavour_role}`)
		}

		const attachment = new Discord.MessageAttachment(flavour.assets[flavour_role.banner], "role_card.png")

		await roles_channel.send(undefined, attachment)

		let sendable = "**{;flavour_role}**: {;info}\n```fix\n{;description}```"

		sendable = sendable.replace(/{;flavour_role}/g, role.getTrueFlavourRole(false))

		let info = ""

		if (flavour.info["display-role-equivalent-on-death"]) {
			info += role.getRole() + "-equivalent; "
		}

		info += cpl(role.getRoleOrThrow().alignment)

		if (flavour.info["show-role-category"]) {
			info += "-" + cpl(role.getRoleOrThrow().class)
		}

		sendable = sendable.replace(/{;info}/g, info)
		sendable = sendable.replace(/{;description}/g, flavour_role["description"] || role.getRoleOrThrow().description)

		await roles_channel.send(sendable)
	}
}

export = uploadPublicRoleInformation
