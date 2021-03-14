// IMPORTANT: assigning
import Player from "../game_templates/Player"
import auxils from "../auxils"
import { Client } from "discord.js"
import { LcnConfig } from "../../LcnConfig"
import getGuild from "../../getGuild"
import alpha_table from "../alpha_table"
import { GameStartError } from "./initGame"

const assignRoles = (client: Client, config: LcnConfig): Player[] => {
	// Role alphabets are assigned in order

	// players mapped by IDs
	const playing = config.playing
	let players = playing.players

	const guild = getGuild(client)

	if (players === "auto") {
		const members = guild.members.cache
			.filter((x) => x.roles.cache.some((y) => y.name === config.permissions.pre))
			.array()
			.sort((a, b) => a.displayName.toLowerCase().localeCompare(b.displayName.toLowerCase()))

		players = members.map((x) => x.id)
	}

	if (!playing.roles) {
		throw new GameStartError("No roles defined in the config")
	}

	const roles = playing.shuffle ? auxils.cryptographicShuffle(playing.roles) : playing.roles
	if (players.length < roles.length) {
		throw new GameStartError(`Not enough players are signed up! (${players.length}/${roles.length})`)
	}
	if (players.length > roles.length) {
		throw new GameStartError(`There are more players than there are roles! (${players.length}/${roles.length})`)
	}
	if (players.length > 26) {
		throw new GameStartError(`Total players exceeds slots bot can accommodate for! (${players.length}/26)`)
	}

	return roles.map((roleName, i) => {
		// Should be only place where the name is assigned
		const alphabet = String.fromCharCode(65 + i)

		// Possible alternative:
		// {identifier, flavour_identifier, display_secondary, attributes: [{identifier, expiry, tags}]}

		// Assign respective roles
		return new Player().init(players[i], alphabet as keyof typeof alpha_table, roleName)
	})
}

export = assignRoles
