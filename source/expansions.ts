import fs from "fs"
import attemptRequiringScript from "./auxils/attemptRequringScript"
import { readAllCommandTypes } from "./commands/commandReader"
import version from "./Version"
import auxils from "./systems/auxils"
import config_handler from "./systems/config_handler"
import { Expansion, ExpansionInfo } from "./Expansion"

const config = config_handler()

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
		const expansion_directory = __dirname + "/expansions/" + identifier

		if (fs.existsSync(expansion_directory) && fs.lstatSync(expansion_directory).isDirectory()) {
			viable_directories.push(expansion_directory)
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
		const scriptsDirectory = directory + "/scripts"

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
				start: attemptRequiringScript(scriptsDirectory, "start"),
				game_prime: attemptRequiringScript(scriptsDirectory, "game_primed"),
				game_start: attemptRequiringScript(scriptsDirectory, "game_start"),
				game_secondary_start: attemptRequiringScript(scriptsDirectory, "game_secondary_start"),
				game_assign: attemptRequiringScript(scriptsDirectory, "game_assign"),
				game_init: attemptRequiringScript(scriptsDirectory, "game_init"),
				cycle: attemptRequiringScript(scriptsDirectory, "cycle"),
				init: attemptRequiringScript(scriptsDirectory, "init"),
			},
		})
	}

	return ret
}

const expansions = getExpansions(config.playing.expansions)
export default expansions
