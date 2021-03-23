import filterDefined from "../../../auxils/filterDefined"
import removeRole from "../../../auxils/removeRole"
import getLogger from "../../../getLogger"
import Game from "../../game_templates/Game"

export = async (game: Game, id1: string, id2: string, detailed_substitution = true): Promise<void> => {
	const logger = getLogger()
	const config = game.config

	const player = game.getPlayer(id1)
	if (!player) {
		throw new Error(`No player found with id ${id1}`)
	}

	const bef_member = player.getGuildMember()
	player.substitute(id2)
	const aft_member = player.getGuildMember()

	logger.log(2, "Player %s substituted for %s.", id1, id2)

	if (!detailed_substitution) {
		return
	}

	const guild = game.getGuild()

	const alive_role = await game.getDiscordRoleOrThrow("alive")
	const dead_role = await game.getDiscordRoleOrThrow("dead")
	const pre_role = guild.roles.cache.find((x) => x.name === config.permissions.pre)
	const spectator_role = guild.roles.cache.find((x) => x.name === config.permissions.spectator)
	const aftermath_role = guild.roles.cache.find((x) => x.name === config.permissions.aftermath)

	if (aft_member) {
		await removeRole(aft_member, filterDefined([alive_role, pre_role, dead_role, spectator_role, aftermath_role]))

		const name = aft_member.displayName.replace(new RegExp("^([[A-z|0-9]{1,2}] )*", "g"), "")

		if (player.isAlive()) {
			await aft_member.roles.add(alive_role)
		} else {
			await aft_member.roles.add(dead_role)
		}

		await aft_member.setNickname("[" + player.alphabet + "] " + name)
	}

	if (bef_member) {
		await removeRole(bef_member, filterDefined([alive_role, pre_role, dead_role, spectator_role, aftermath_role]))

		const name = bef_member.displayName.replace(new RegExp("^([[A-z|0-9]{1,2}] )*", "g"), "")

		if (name !== bef_member.displayName) {
			await bef_member.setNickname(name)
		}
	}

	if (!bef_member || !aft_member) {
		logger.log(4, "Non-existent substitution Discord user - skipping permission transfer.")
		return
	}

	// Complete permission transfer
	const channels = filterDefined(
		player.getSpecialChannels().map((x) => guild.channels.cache.find((y) => y.id === x.id))
	)

	const cache: Promise<unknown>[] = []

	for (let i = 0; i < channels.length; i++) {
		const channel = channels[i]

		const permissions = channel.permissionsFor(bef_member)

		if (!permissions) {
			continue
		}

		cache.push(channel.createOverwrite(aft_member, permissions.serialize()))

		const override = channel.permissionOverwrites.find((x) => x.id === bef_member.id)
		if (override) {
			cache.push(override.delete())
		}
	}

	await Promise.all(cache)
}
