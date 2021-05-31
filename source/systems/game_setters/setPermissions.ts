import { GuildChannel, PermissionObject } from "discord.js"
import getLogger from "../../getLogger"
import { LcnConfig } from "../../LcnConfig"
import Player from "../game_templates/Player"

const setRoleOf = async (channel: GuildChannel, player: Player, perms: PermissionObject): Promise<void> => {
	const member = player.getGuildMember()

	if (member) {
		await channel.createOverwrite(member, perms)
	} else {
		console.error(`No member found for player ${player.getDisplayName()}`)
	}
}

const setPermissions = async (config: LcnConfig, roles: Player[]): Promise<void> => {
	// Set permissions to view channels
	const logger = getLogger()
	logger.log(2, "Setting permissions.")

	const post_perms = config["base-perms"].post

	for (const player of roles) {
		const channel = player.getPrivateChannel()
		await setRoleOf(channel, player, post_perms)
	}
}

export default setPermissions
