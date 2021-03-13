import fs from "fs"
import attemptRequiringScript from "../auxils/attemptRequringScript"
import botDirectories from "../BotDirectories"
import { readAllCommandTypes } from "../commands/commandReader"
import version from "../Version"
import auxils from "./auxils"
import config_handler from "./config_handler"
import { Expansion, ExpansionInfo } from "./Expansion"

const config = config_handler()
const expansion_directories = botDirectories.expansions

const attemptReaddir = (directory: string): string[] => (fs.existsSync(directory) ? fs.readdirSync(directory) : [])

const getExpansions = (identifiers: string[], scanned: Expansion[] = []): Expansion[] => {
	let ret: Expansion[] = []

	for (let i = 0; i < identifiers.length; i++) {
		const identifier = identifiers[i].toLowerCase()

		if (identifier === "lcn") {
			throw new Error('Cannot have an expansion named "lcn"!')
		}

		if (scanned.some((x) => x.identifier === identifier)) {
			// To prevent scanning twice
			return []
		}

		const viable_directories = []
		for (let j = 0; j < expansion_directories.length; j++) {
			const expansion_directory = expansion_directories[j] + identifier

			if (fs.existsSync(expansion_directory) && fs.lstatSync(expansion_directory).isDirectory()) {
				viable_directories.push(expansion_directory)
			}
		}

		if (viable_directories.length < 1) {
			throw new Error('Expansion "' + identifier + '" does not exist.')
		}

		if (viable_directories.length > 1) {
			throw new Error(
				'Multiple instances of expansion "' +
					identifier +
					'" [' +
					viable_directories.join(", ") +
					"] have been found - can only load one!"
			)
		}

		const directory = viable_directories[0]

		// Read information JSON
		const expansion = require(`${directory}/expansion.json`) as ExpansionInfo

		ret = ret.concat(getExpansions(expansion.dependencies || [], ret))

		if (expansion.compatibility) {
			const compatible = auxils.compareVersion(version.version, expansion.compatibility)

			if (!compatible) {
				throw new Error(
					`Incompatible expansion pack "${identifier}" - expansion version is for ${expansion.compatibility} however LCN is on ${version.version}.`
				)
			}
		}

		// Add information
		ret.push({
			expansion_directory: directory,
			identifier: identifier,
			expansion: expansion,
			commands: readAllCommandTypes(directory + "/commands"),
			additions: {
				assets: attemptReaddir(directory + "/assets"),
				roles: attemptReaddir(directory + "/roles"),
				flavours: attemptReaddir(directory + "/flavours"),
				role_win_conditions: attemptReaddir(directory + "/role_win_conditions"),
				attributes: attemptReaddir(directory + "/attributes"),
			},
			scripts: {
				start: attemptRequiringScript(directory, "start"),
				game_prime: attemptRequiringScript(directory, "game_primed"),
				game_start: attemptRequiringScript(directory, "game_start"),
				game_secondary_start: attemptRequiringScript(directory, "game_secondary_start"),
				game_assign: attemptRequiringScript(directory, "game_assign"),
				game_init: attemptRequiringScript(directory, "game_init"),
				cycle: attemptRequiringScript(directory, "cycle"),
				init: attemptRequiringScript(directory, "init"),
			},
		})
	}

	return ret
}

const expansions = getExpansions(config.playing.expansions)
export = expansions
