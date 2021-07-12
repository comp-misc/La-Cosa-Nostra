import requireScript from "../auxils/requireScript"
import ruleFilter from "../auxils/ruleFilter"
import expansions from "../expansions"
import lazyGet from "../lazyGet"
import Game from "./game_templates/Game"
import Player from "./game_templates/Player"

export interface WinCondition {
	(game: Game): boolean | Promise<boolean>

	id: string

	/** Should the game end after they win? */
	STOP_GAME: boolean

	/** No other roles will be checked, equates to a solo win condition */
	STOP_CHECKS: boolean

	/** Priority of the win condition. Lower values will be checked first */
	PRIORITY: number

	/** List of players/alignments/classes which must be eliminated to win */
	ELIMINATED: string[]

	/** List of players/alignments/classes which can survive to win */
	SURVIVING: (string | ((player: Player) => boolean))[]

	/** List of roles which cannot win if this win condition succeeds */
	PREVENT_CHECK_ON_WIN: string[]

	DESCRIPTION: string
	CHECK_ONLY_WHEN_GAME_ENDS?: boolean
}

export default lazyGet(() => {
	const ret: Record<string, WinCondition> = {}
	let rules: string[] = []
	let scripts: string[] = []

	// Add expansions
	for (let i = 0; i < expansions.length; i++) {
		scripts = scripts.concat(
			expansions[i].additions.role_win_conditions.map((x) => expansions[i].identifier + "/" + x)
		)
		rules = rules.concat(expansions[i].expansion.overrides?.role_win_conditions || [])
	}

	scripts = ruleFilter(scripts, rules)

	for (let i = 0; i < scripts.length; i++) {
		const script_info = scripts[i].split("/")

		const expansion_identifier = script_info[0]
		const scriptName = script_info[1]

		const expansion = expansions.find((x) => x.identifier === expansion_identifier)
		if (!expansion) {
			throw new Error(`Unable to find expansion with identifier ${expansion_identifier}`)
		}
		const scriptFile = expansion.expansion_directory + "/role_win_conditions/" + scriptName

		if (!scripts[i].endsWith(".js") && !scripts[i].endsWith(".ts")) {
			continue
		}

		const runnable = requireScript<WinCondition>(scriptFile)
		const key = scriptName.substring(0, scriptName.length - 3)
		ret[key] = runnable
	}
	return ret
})
