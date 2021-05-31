import filterDefined from "../../../../auxils/filterDefined"
import getLogger from "../../../../getLogger"
import { RolePermission } from "../../../../systems/executable/misc/createPrivateChannel"
import Game from "../../../../systems/game_templates/Game"
import Player from "../../../../systems/game_templates/Player"

// Always put lower alphabet first
const createMasonChannels = async (game: Game, players: Player[]): Promise<void> => {
	const config = game.config
	const read_perms = config["base-perms"].read

	players.sort((a, b) => a.alphabet.localeCompare(b.alphabet))

	const name = "mason-" + players.map((x) => x.alphabet).join("-")

	const perms: RolePermission[] = filterDefined(
		players.map((x) => {
			const user = x.getDiscordUser()
			if (!user) {
				getLogger().log(
					2,
					`No discord user for player ${x.getDisplayName()} - can't set permissions for mason channel correctly`
				)
				return undefined
			}
			return { target: user, permissions: read_perms }
		})
	)

	const channel = await game.createPrivateChannel(name, perms)

	for (const player of players) {
		// Add channels
		player.misc.mason_channel = channel.id
		player.addSpecialChannel(channel)
	}

	await channel.send("**This is the mason chat.**\n\nThis chat is open to involved parties only at night.")

	game.setChannel(name, channel)
}

export default createMasonChannels
