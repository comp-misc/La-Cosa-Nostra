// Enumerate roles
import fs from "fs"
import attemptRequiringScript from "../auxils/attemptRequiringScript"
import { Expansion } from "../Expansion"
import expansions from "../expansions"
import lazyGet from "../lazyGet"
import { CompleteRole, LegacyRole, LoadedRoleMetadata, RoleConstructor, RolePart } from "../role"

const loadRole = (expansion: Expansion, roleId: string, type: "part" | "complete"): LoadedRoleMetadata => {
	const directory = expansion.expansion_directory + "/" + (type === "part" ? "parts" : "roles") + "/" + roleId
	if (!fs.existsSync(directory)) {
		throw new Error(`Unable to find role directory '${directory}'`)
	}
	if (!fs.lstatSync(directory).isDirectory()) {
		throw new Error(`Role path '${directory}' must be a directory`)
	}
	const roleClass = attemptRequiringScript<RoleConstructor<RolePart<unknown, unknown>, unknown, unknown>>(
		directory,
		"index"
	)
	if (roleClass) {
		Object.assign(roleClass, {
			roleMetadata: {
				directory,
				type,
				expansion: expansion.identifier,
				identifier: roleId,
			},
		})
	}

	if (!roleClass && type === "part") {
		throw new Error(`No role class found at '${directory + "/index.[js,ts]"}'`)
	}
	const commonData = {
		directory,
		expansion: expansion.identifier,
		identifier: roleId,
	}

	if (!roleClass || type === "complete") {
		return {
			type: roleClass ? "complete" : "legacy",
			constructor: (roleClass || LegacyRole) as RoleConstructor<CompleteRole<unknown, unknown>, unknown, unknown>,
			...commonData,
		}
	}
	return {
		type: "part",
		constructor: roleClass,
		...commonData,
	}
}

export default lazyGet(() => {
	const roleList: Record<string, LoadedRoleMetadata> = {}
	// Read files [role]/[actions]/<name>
	// Enumerate as [role]-<name>

	const roles = expansions.flatMap((expansion) =>
		expansion.additions.roles.map((x) => expansion.identifier + "/" + x)
	)
	const parts = expansions.flatMap((expansion) =>
		expansion.additions.roleParts.map((x) => expansion.identifier + "/" + x)
	)

	// Add expansions
	const loadRoles = (list: string[], type: "part" | "complete") => {
		for (const roleDescriptor of list) {
			const roleInfo = roleDescriptor.split("/")

			const expansionId = roleInfo[0]
			const roleId = roleInfo[1]

			const expansion = expansions.find((x) => x.identifier === expansionId)
			if (!expansion) {
				throw new Error(`Unable to find expansion with identifier ${expansionId}`)
			}
			roleList[expansion.identifier + "/" + roleId] = loadRole(expansion, roleId, type)
		}
	}
	loadRoles(roles, "complete")
	loadRoles(parts, "part")
	return roleList
})
