import cryptographicShuffle from "../../../../../auxils/cryptographicShuffle";
import { RoleStart } from "../../../../../systems/Role";
import Player from "../../../../../systems/game_templates/Player";
import { RolePermission } from "../../../../../systems/executable/misc/createPrivateChannel";
import getLogger from "../../../../../getLogger";
import filterDefined from "../../../../../auxils/filterDefined";
import Game from "../../../../../systems/game_templates/Game";

// Always put lower alphabet first
const createMasonChannels = async (game: Game, players: Player[]) => {
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

const start: RoleStart = async (player) => {
	const game = player.getGame()
	if (player.misc.paired) {
		return
	}

	// Form as many pairs as possible before forming triplets
	const available = cryptographicShuffle(
		game.findAll(
			(x) =>
				x.role_identifier === "town_mason" &&
				x.isAlive() &&
				x.identifier !== player.identifier &&
				!x.misc.paired
		)
	)

	if (available.length < 1) {
		throw new Error("Unpairable number of masons!")
	}

	player.misc.mason_initiator = true

	let group: Player[]
	if (available.length === 2) {
		group = [player].concat(available.splice(0, 2))
	} else {
		group = [player].concat(available.splice(0, 1))
	}

	for (let i = 0; i < group.length; i++) {
		group[i].misc.paired = true
	}
	await createMasonChannels(game, group)
}

export default start
