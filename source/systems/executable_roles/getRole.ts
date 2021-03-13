import { RoleProperties, RoleRoutine, RoleStart } from "../Role"
import roles from "../roles"

export interface ExpandedRole extends RoleProperties {
	description: string
	role_card?: Promise<Buffer>
	routine?: RoleRoutine
	start?: RoleStart
}

/*
	Find the role from the name
	NOTE: SHOULD INCLUDE FUNCTION PROTOTYPES
*/
export default (identifier: string, silent = false): ExpandedRole | null => {
	identifier = identifier.toLowerCase()

	// Deprecation reformat
	const role = roles[identifier]

	if (!role) {
		if (silent) {
			return null
		}

		throw new Error('Role "' + identifier + '" does not exist!')
	}

	return {
		...role.role,
		description: role.description,
		role_card: role.role_card,
		routine: role.routine,
		start: role.start,
	}
}
