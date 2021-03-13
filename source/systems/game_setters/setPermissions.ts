import { GuildChannel, PermissionOverwriteOptions, Snowflake } from "discord.js"
import getLogger from "../../getLogger"
import { LcnConfig } from "../../LcnConfig"
import Player from "../game_templates/Player"

const setRoleOf = async (channel: GuildChannel, id: Snowflake, perms: PermissionOverwriteOptions): Promise<void> => {
	const member = channel.guild.members.get(id)

	if (member) {
		await channel.overwritePermissions(member, perms)
	}
}

const setPermissions = async (config: LcnConfig, roles: Player[]): Promise<void> => {
	// Set permissions to view channels
	const logger = getLogger()
	logger.log(2, "Setting permissions.")

	const read_perms = config["base-perms"]["read"]
	const post_perms = config["base-perms"]["post"]

	for (let i = 0; i < roles.length; i++) {
		const channel = roles[i].getPrivateChannel()

		await setRoleOf(channel, roles[i].id, post_perms)

		// If Mafia chat is enabled
		if (config.game.mafia["has-chat"] && (roles[i]["see_mafia_chat"] || roles[i].role?.["see-mafia-chat"] === true)) {
			// Allow role to see channel
			await setRoleOf(channel, roles[i].id, read_perms)

			// Important addon
			roles[i].addSpecialChannel(channel)
		}
	}
}

export = setPermissions
