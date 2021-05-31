// Actionables are only from attributes and roles
import fs from "fs"
import expansions from "../expansions"
import attributes from "./attributes"
import getRoles from "./roles"
import { Actionable, ActionableTag, ExecutionParams } from "./game_templates/Actions"
import Game from "./game_templates/Game"
import recursiveFileFind from "../auxils/recursiveFileFind"
import requireScript from "../auxils/requireScript"

export interface RoleActionable<T = unknown> {
	(actionable: Actionable<T>, game: Game, params?: ExecutionParams): void | boolean | Promise<void> | Promise<boolean>
	TAGS?: ActionableTag[]
}

const cycle = (directory: string) => (fs.existsSync(directory) ? recursiveFileFind(directory, ["js", "ts"]) : [])

const actionables: Record<string, RoleActionable> = {}

const usable_directory = __dirname + "/../global_actionables"
const global_actionables = cycle(usable_directory)

global_actionables.forEach((actionable) => {
	const key = "g/" + actionable.substring(usable_directory.length + 1, actionable.length - 3)
	actionables[key] = requireScript(actionable)
})

expansions.forEach((expansion) => {
	const usable_directory = expansion.expansion_directory + "/global_actionables"

	const global_actionables = cycle(usable_directory)
	for (let j = 0; j < global_actionables.length; j++) {
		const key =
			"g/" + global_actionables[j].substring(usable_directory.length + 1, global_actionables[j].length - 3)
		actionables[key] = requireScript(global_actionables[j])
	}
})

const roles = getRoles()
for (const role in roles) {
	const directory = roles[role].directory + "/actionables"
	const actions = cycle(directory)

	actions.forEach((action) => {
		const key = role + action.substring(directory.length, action.length - 3)
		actionables[key] = requireScript(action)
	})
}

for (const attribute in attributes) {
	const directory = attributes[attribute].directory + "/actionables"
	const actions = cycle(directory)

	for (let i = 0; i < actions.length; i++) {
		const key = "a/" + attribute + actions[i].substring(directory.length, actions[i].length - 3)
		actionables[key] = requireScript(actions[i])
	}
}

for (const key in actionables) {
	if (typeof actionables[key] !== "function") {
		throw new Error(`Actionable '${key}' is not a valid function`)
	}
}

//TODO Dont include actionables from excludes roles

export default actionables
