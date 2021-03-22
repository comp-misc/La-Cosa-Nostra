// Enumerate roles
import fs from "fs"

import expansions from "../expansions"
import auxils from "./auxils"
import attemptRequiringScript from "../auxils/attemptRequringScript"
import attemptRequiring from "../auxils/attemptRequiring"
import { Role, RoleInfo, RoleProperties, RoleRoutine, RoleStart } from "./Role"

const attemptRead = (directory: string): string | null => {
	const exists = fs.existsSync(directory)

	if (exists) {
		return fs.readFileSync(directory, "utf8")
	} else {
		return null
	}
}

const ret: Record<string, Role> = {}

// Read files [role]/[actions]/<name>
// Enumerate as [role]-<name>

let rules: string[] = []
let roles: string[] = []

// Add expansions
expansions.forEach((expansion) => {
	roles = roles.concat(expansion.additions.roles.map((x) => expansion.identifier + "/" + x))
	rules = rules.concat(expansion.expansion.overrides?.roles || [])
})

roles = auxils.ruleFilter(roles, rules)

for (let i = 0; i < roles.length; i++) {
	const role_info = roles[i].split("/")

	const expansion_identifier = role_info[0]
	const role = role_info[1]

	const expansion = expansions.find((x) => x.identifier === expansion_identifier)
	if (!expansion) {
		throw new Error(`Unable to find expansion with identifier ${expansion_identifier}`)
	}
	const directory = expansion.expansion_directory + "/roles/" + role

	if (fs.lstatSync(directory).isDirectory()) {
		// Read information file
		const info = attemptRequiring<RoleInfo>(directory + "/info.json")
		const description = attemptRead(directory + "/description.txt")
		const role_json = attemptRequiring<RoleProperties>(directory + "/role.json")
		const routine = attemptRequiringScript<RoleRoutine>(directory + "/general/", "routines")
		const start = attemptRequiringScript<RoleStart>(directory + "/general/", "start")

		if (!role_json) {
			throw new Error(`${role}'s role.json does not exist!`)
		}
		if (!info) {
			throw new Error(`${role}'s info.json does not exist`)
		}

		ret[role] = {
			directory,
			role: role_json,
			description: description || "",
			info: info,
			routine,
			start,
		}

		// Get role card
		if (fs.existsSync(directory + "/role_card.png")) {
			ret[role].role_card = new Promise(function (resolve, reject) {
				fs.readFile(directory + "/role_card.png", (err, data) => {
					if (err) {
						reject(data)
					}

					resolve(Buffer.from(data))
				})
			})
		}
	}
}

export default ret
