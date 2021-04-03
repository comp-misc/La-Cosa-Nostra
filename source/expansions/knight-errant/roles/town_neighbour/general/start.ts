import cryptographicShuffle from "../../../../../auxils/cryptographicShuffle"
import { RoleStart } from "../../../../../systems/Role"
import Player from "../../../../../systems/game_templates/Player"
import { RolePermission } from "../../../../../systems/executable/misc/createPrivateChannel"
import getLogger from "../../../../../getLogger"
import filterDefined from "../../../../../auxils/filterDefined"

const start: RoleStart = async (player) => {
	const game = player.getGame()
	const config = game.config

	if (player.misc.paired) {
		return null
	}

	// Form as many pairs as possible before forming triplets
	const available = cryptographicShuffle(
		game.findAll(
			(x) =>
				x.role_identifier === "town_neighbour" &&
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

	// Always put lower alphabet first
	const createMasonChannels = async (players: Player[]) => {
		const read_perms = config["base-perms"].read

		players.sort((a, b) => {
			if (a.alphabet < b.alphabet) {
				return -1
			}
			if (a.alphabet > b.alphabet) {
				return 1
			}
			return 0
		})

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

		for (let i = 0; i < players.length; i++) {
			// Add channels
			players[i].misc.mason_channel = channel.id

			players[i].addSpecialChannel(channel)
		}

		await channel.send("**This is the neighbour' chat.**\n\nThis chat is open to involved parties only at night.")

		game.setChannel(name, channel)
	}

	await createMasonChannels(group)
}

export default start
