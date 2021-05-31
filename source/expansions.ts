import fs from "fs"
import attemptRequiringScript from "./auxils/attemptRequiringScript"
import recursiveFileFind from "./auxils/recursiveFileFind"
import { readAllCommandTypes } from "./commands/commandReader"
import { Expansion, ExpansionInfo } from "./Expansion"
import lazyGet from "./lazyGet"
import auxils from "./systems/auxils"
import config_handler from "./systems/config_handler"
import version from "./Version"

const config = config_handler()

const attemptReaddirDirectories = (directory: string): string[] =>
	attemptReaddir(directory).filter((f) => fs.lstatSync(directory + "/" + f).isDirectory())
const attemptReaddir = (directory: string): string[] => (fs.existsSync(directory) ? fs.readdirSync(directory) : [])

const getExpansions = (identifiers: string[], scanned: Expansion[] = []): Expansion[] => {
	let ret: Expansion[] = []

	for (let i = 0; i < identifiers.length; i++) {
		const identifier = identifiers[i].toLowerCase()

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
		// eslint-disable-next-line @typescript-eslint/no-var-requires
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

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const lazyScript = <T extends (...args: any[]) => any>(
			directory: string,
			scriptName: string
		): ((...funcArgs: Parameters<T>) => ReturnType<T>) | undefined => {
			let exists = false
			for (const extension of ["ts", "js"]) {
				if (fs.existsSync(directory + "/" + scriptName + "." + extension)) {
					exists = true
					break
				}
			}
			if (!exists) {
				return undefined
			}

			const scriptLazy = lazyGet(() => attemptRequiringScript<T>(directory, scriptName))

			return (...args: Parameters<T>): ReturnType<T> => {
				const script = scriptLazy()
				if (script) {
					return script(...args)
				}
				throw new Error("Undefined script")
			}
		}

		// Add information
		ret.push({
			expansion_directory: directory,
			identifier,
			expansion,
			commands: readAllCommandTypes(directory + "/commands"),
			additions: {
				assets: recursiveFileFind(directory + "/assets"),
				roles: attemptReaddirDirectories(directory + "/roles"),
				flavours: attemptReaddirDirectories(directory + "/flavours"),
				role_win_conditions: attemptReaddir(directory + "/role_win_conditions"),
				attributes: attemptReaddirDirectories(directory + "/attributes"),
			},
			scripts: {
				start: lazyScript(scriptsDirectory, "start"),
				game_start: lazyScript(scriptsDirectory, "game_start"),
				game_secondary_start: lazyScript(scriptsDirectory, "game_secondary_start"),
				game_assign: lazyScript(scriptsDirectory, "game_assign"),
				game_init: lazyScript(scriptsDirectory, "game_init"),
				cycle: lazyScript(scriptsDirectory, "cycle"),
				init: lazyScript(scriptsDirectory, "init"),
			},
		})
	}

	return ret
}

const expansions = getExpansions(config.playing.expansions)
export default expansions
