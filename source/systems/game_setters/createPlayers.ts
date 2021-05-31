import crypto from "crypto"
import cryptographicShuffle from "../../auxils/cryptographicShuffle"
import { LcnConfig, SetupRole } from "../../LcnConfig"
import alpha_table from "../alpha_table"
import Game from "../game_templates/Game"
import Player from "../game_templates/Player"
import { ProgrammableRole, Role } from "../Role"
import { instantiateRoleFromId } from "../roles"
import { GameStartError } from "./initGame"

const createPlayers = (game: Game, config: LcnConfig): Player[] => {
	const playing = config.playing
	let players = playing.players

	const guild = game.getGuild()

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

	const roles: SetupRole[] = playing.shuffle ? cryptographicShuffle(playing.roles) : playing.roles
	if (players.length < roles.length) {
		throw new GameStartError(`Not enough players are signed up! (${players.length}/${roles.length})`)
	}
	if (players.length > roles.length) {
		throw new GameStartError(`There are more players than there are roles! (${players.length}/${roles.length})`)
	}
	if (players.length > 26) {
		throw new GameStartError(`Total players exceeds slots bot can accommodate for! (${players.length}/26)`)
	}

	return roles.map((role: SetupRole, i) => {
		// Should be only place where the name is assigned
		const alphabet = String.fromCharCode(65 + i) as keyof typeof alpha_table
		const identifier = crypto.randomBytes(8).toString("hex")

		const realRole =
			typeof role === "string"
				? instantiateRoleFromId<ProgrammableRole<undefined>, undefined>(role, undefined)
				: role

		return new Player(game, players[i], identifier, alphabet, realRole as Role)
	})
}

export default createPlayers
