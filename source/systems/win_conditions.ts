import requireScript from "../auxils/requireScript"
import ruleFilter from "../auxils/ruleFilter"
import expansions from "../expansions"
import Game from "./game_templates/Game"
import Player from "./game_templates/Player"

export interface WinCondition {
	(game: Game): boolean | Promise<boolean>
	STOP_GAME: boolean
	STOP_CHECKS: boolean
	FACTIONAL: boolean
	PRIORITY: number
	ELIMINATED: string[]
	SURVIVING: (string | ((player: Player) => boolean))[]
	PREVENT_CHECK_ON_WIN: string[]
	DESCRIPTION: string
	CHECK_ONLY_WHEN_GAME_ENDS?: boolean
}

const ret: Record<string, WinCondition> = {}
let rules: string[] = []
let scripts: string[] = []

// Add expansions
for (let i = 0; i < expansions.length; i++) {
	scripts = scripts.concat(expansions[i].additions.role_win_conditions.map((x) => expansions[i].identifier + "/" + x))
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

export default ret
