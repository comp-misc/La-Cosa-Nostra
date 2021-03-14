import crypto from "crypto"
import flavours from "../../systems/flavours"
import auxils from "../../systems/auxils"

import configModifier from "../../systems/game_setters/configModifier"
import { AdminCommand } from "../CommandType"
import { LcnConfig } from "../../LcnConfig"
import getGuild from "../../getGuild"

const computeHash = (config: LcnConfig): string => {
	const flavour = config.playing.flavour || ""

	const flavour_info = flavours[flavour]
	if (!flavour_info) {
		throw new Error("No flavour found")
	}

	const order = [config.playing.roles, config.game, flavour, flavour_info]

	const hash = crypto.createHash("md5")
	for (let i = 0; i < order.length; i++) {
		let update = JSON.stringify(order[i], auxils.jsonInfinityCensor)

		if (!update) {
			update = "[X]"
		}

		hash.update(update)
	}

	return hash.digest("hex")
}

const _verifysetup: AdminCommand = async (message, params, config) => {
	config = configModifier(config)

	const players = config.playing.players
	const guild = getGuild(message.client)

	if (!guild) {
		await message.channel.send(
			":x: The guild has been wrongly configured. Please change this in the config before initialising."
		)
		return null
	}

	let names: string[] = []
	if (players !== "auto") {
		for (let i = 0; i < players.length; i++) {
			const member = guild.members.cache.find((x) => x.id === players[i])

			if (!member) {
				names.push("undef'd player (" + players[i] + ")")
				continue
			}

			// Run
			names.push(member.displayName + " (" + players[i] + ")")
		}
	} else {
		const members = guild.members.cache
			.filter((x) => x.roles.cache.some((y) => y.name === config.permissions.pre))
			.array()

		members.sort(function (a, b) {
			if (a.displayName.toLowerCase() < b.displayName.toLowerCase()) {
				return -1
			}
			if (a.displayName.toLowerCase() > b.displayName.toLowerCase()) {
				return 1
			}
			return 0
		})

		names = members.map((x) => x.displayName + " (" + x.id + ")")
	}

	await message.channel.send(":hourglass_flowing_sand: **SETUP AUDIT REPORT** :hourglass_flowing_sand:")

	// Server details
	await message.channel.send(
		"_ _\n**:computer: Server Details :computer:**\n```fix\nServer Name: " +
			guild.name +
			"\nServer ID: " +
			guild.id +
			"\n```"
	)

	// Registered players
	await message.channel.send(
		"_ _\n**:spy: Registered Players (" +
			names.length +
			"/" +
			(config.playing.roles?.length || 0) +
			") :spy:**\n```fix\n" +
			names.map((x, i) => i + 1 + ". " + x).join("\n") +
			"\n\nShuffle roles on assign: " +
			config.playing.shuffle +
			"```"
	)

	// Game details
	await message.channel.send(
		"_ _\n**:game_die: Game Details :game_die:**\n```js\n" +
			JSON.stringify(config.game, auxils.jsonInfinityCensor, 3) +
			"```"
	)

	// Timezone and cycles
	const timezone = config.time
	await message.channel.send(
		"_ _\n**:clock11: Timezone and Cycles :clock11:**\n```fix\nTimezone: UTC+" +
			timezone.timezone +
			"\nGame cycles: " +
			timezone.day +
			" hours / " +
			timezone.night +
			" hours\n```"
	)

	const hash = computeHash(config)
	await message.channel.send(
		"_ _\n**:exclamation: Set-up Hash :exclamation:**\n**`" +
			hash +
			"`**\n\n*(Note that hashes will change if role determination uses random mechanics.)*"
	)
}

export = _verifysetup
