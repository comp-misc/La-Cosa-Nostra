import lcn from "../../../../../source/lcn"
import { RolePermission } from "../../../../../source/systems/executable_misc/createPrivateChannel"
import Game from "../../../../../source/systems/game_templates/Game"
import Player from "../../../../../source/systems/game_templates/Player"
import { RoleStart } from "../../../../../source/systems/Role"

// Executes BEFORE introduction

const getLoversDisplay = (lovers: Player[]): string => {
	if (lovers.length == 1) {
		return ":heart:  Your lover is **" + lovers[0].getDisplayName() + "**!"
	} else {
		let display = ":heart:  Your lovers are **" + lovers[0].getDisplayName() + "**"
		for (let i = 0; i < lovers.length - 2; i++) {
			display = display + ", **" + lovers[i + 1].getDisplayName() + "**"
		}
		display = display + " and **" + lovers[lovers.length - 1].getDisplayName() + "**!"
		return display
	}
}

const createLoverChannels = async (players: Player[], game: Game): Promise<void> => {
	const read_perms = game.config["base-perms"]["read"]

	players.sort((a, b) => {
		if (a.alphabet < b.alphabet) {
			return -1
		}
		if (a.alphabet > b.alphabet) {
			return 1
		}
		return 0
	})

	const name = "lovers-" + players.map((x) => x.alphabet).join("-")

	const perms: RolePermission[] = players.map((x) => {
		const discordUser = x.getDiscordUser()
		if (!discordUser) {
			throw new Error(`No discord user found for ${x.getDisplayName()}`)
		}
		return { target: discordUser, permissions: read_perms }
	})

	const channel = await game.createPrivateChannel(name, perms)

	for (let i = 0; i < players.length; i++) {
		// Add channels
		players[i].misc.lover_channel = channel.id

		players[i].addSpecialChannel(channel)
	}

	await channel.send("**This is the Lovers' chat.**\n\nThis chat is open to involved parties only at night.")

	game.setChannel(name, channel)
}

const start: RoleStart = async (player) => {
	const game = player.getGame()

	// Form as many pairs as possible before forming triplets
	let available = game.findAll(
		(x) => x.role_identifier === "town_lover" && x.isAlive() && x.identifier !== player.identifier
	)

	const display = getLoversDisplay(available)

	player.addIntroMessage(display)

	for (let i = 0; i < available.length - 2; i++) {
		if (available[i].misc.suicide === true) {
			return null
		}

		game.addAction("town_lover/suicide", ["killed"], {
			from: player.id,
			to: available[i].id,
			expiry: Infinity,
			tags: ["permanent"],
		})
	}

	available = lcn.auxils.cryptographicShuffle(available)

	if (player.misc.paired) {
		return
	}

	if (available.length < 1) {
		throw new Error("Unpairable number of lovers!")
	}

	player.misc.lover_initiator = true

	let group: Player[]
	if (available.length === 2) {
		group = [player].concat(available.splice(0, 2))
	} else {
		group = [player].concat(available.splice(0, 1))
	}

	for (let i = 0; i < group.length; i++) {
		group[i].misc.paired = true
	}

	await createLoverChannels(group, game)

	// Always put lower alphabet first
}

export = start
