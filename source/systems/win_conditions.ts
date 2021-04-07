import expansions from "../expansions"
import auxils from "./auxils"
import Game from "./game_templates/Game"
import Player from "./game_templates/Player"
import roles from "./roles"

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

scripts = auxils.ruleFilter(scripts, rules)

for (let i = 0; i < scripts.length; i++) {
	const script_info = scripts[i].split("/")

	const expansion_identifier = script_info[0]
	const script = script_info[1]

	const expansion = expansions.find((x) => x.identifier === expansion_identifier)
	if (!expansion) {
		throw new Error(`Unable to find expansion with identifier ${expansion_identifier}`)
	}
	const directory = expansion.expansion_directory + "/role_win_conditions/" + script

	if (!scripts[i].endsWith(".js") && !scripts[i].endsWith(".ts")) {
		continue
	}

	const runnable = require(directory)
	const key = script.substring(0, script.length - 3)
	ret[key] = runnable
}

for (const [id, role] of Object.entries(roles)) {
	const winCon = ret[role.role["win-condition"]]
	if (!winCon) {
		throw new Error("Unknown win condition '" + role.role["win-condition"] + "' for role " + id)
	}
}

export default ret
