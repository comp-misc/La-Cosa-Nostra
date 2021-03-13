// IMPORTANT: assigning
import Player from "../game_templates/Player"
import auxils from "../auxils"
import { Client } from "discord.js"
import { LcnConfig } from "../../LcnConfig"
import getGuild from "../../getGuild"
import alpha_table from "../alpha_table"

export = (client: Client, config: LcnConfig): Player[] => {
	// Role alphabets are assigned in order

	// players mapped by IDs
	const playing = config.playing
	let players = playing.players

	const guild = getGuild(client)

	if (players === "auto") {
		const members = guild.members.filter((x) => x.roles.some((y) => y.name === config.permissions.pre)).array()

		members.sort(function (a, b) {
			if (a.displayName.toLowerCase() < b.displayName.toLowerCase()) {
				return -1
			}
			if (a.displayName.toLowerCase() > b.displayName.toLowerCase()) {
				return 1
			}
			return 0
		})

		players = members.map((x) => x.id)
	}

	if (!playing.roles) {
		throw new Error("No roles defined in the config")
	}
	const roles = playing["shuffle"] ? auxils.cryptographicShuffle(playing.roles) : playing.roles

	if (roles.length !== players.length) {
		const err = "Role length should be equal to number of players!"
		throw new Error(err)
	}

	const ret: Player[] = []

	// Check accommodation
	if (playing.players.length > 26) {
		// Cannot accommodate
		throw new Error(`Total players exceeds slots bot can accommodate for!`)
	}

	for (let i = 0; i < players.length; i++) {
		// Should be only place where the name is assigned
		const alphabet = String.fromCharCode(65 + i)

		// Possible alternative:
		// {identifier, flavour_identifier, display_secondary, attributes: [{identifier, expiry, tags}]}

		const role = roles[i]
		//TODO The roles from the config shouldn't be populated as a fully fledged Role?
		const base_identifier: string = (role as any).identifier || role

		// Assign respective roles
		const player = new Player().init(players[i], alphabet as keyof typeof alpha_table, base_identifier.toLowerCase())

		if ((role as any) instanceof Object) {
			const alreadySetRole = (role as any) as Player

			//TODO What even is this??
			if ((role as any).alreadySetRole.flavour_identifier) {
				player.setBaseFlavourIdentifier((role as any).flavour_identifier)
			}

			if (alreadySetRole.display_secondary) {
				player.setDisplaySecondary(alreadySetRole.display_secondary)
			}

			if (alreadySetRole.attributes) {
				for (let j = 0; j < alreadySetRole.attributes.length; j++) {
					const attribute = alreadySetRole.attributes[j]
					player.addAttribute(attribute.identifier, attribute.expiry, attribute.tags)
				}
			}
		}

		ret.push(player)
	}

	return ret
}
