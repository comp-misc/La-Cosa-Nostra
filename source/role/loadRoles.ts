import { RoleInfo } from "."
import { CompleteRole } from "./CompleteRole"
import { LegacyRole } from "./LegacyRole"
import { RoleMetadata } from "./RoleMetadata"
import { RolePart } from "./RolePart"
import getRoles from "../systems/roles"

export interface RolePrototypeMetadata {
	identifier: string
	expansion: string
	directory: string
	type: "complete" | "part"
}

export const findRoleMetadata = <T extends RolePart<unknown, unknown>>(role: T): RoleMetadata<T> => {
	if (role instanceof LegacyRole) {
		return {
			...role.config,
			role,
			type: "legacy",
		}
	}

	const constructor: any = Object.getPrototypeOf(role).constructor
	if (constructor.roleMetadata !== undefined) {
		const metadata = constructor.roleMetadata as RolePrototypeMetadata
		return {
			role,
			...metadata,
		}
	}

	for (const roleData of Object.values(getRoles())) {
		if (roleData.constructor === constructor) {
			return {
				role,
				...roleData,
			}
		}
	}
	//Prototype isn't really a string but fixes concatenation
	throw new Error(
		"Role for '" +
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			((constructor.name as string | undefined) || role.toString()) +
			"' not loaded/registered"
	)
}

export const createRoleInfoFromId = (roleId: string): RoleInfo => {
	const roleData = getRoles()[roleId]
	if (!roleData) {
		throw new Error(`Unknown role ${roleId}`)
	}
	if (roleData.type !== "legacy") {
		throw new Error(`Role ${roleId} must be instantiated`)
	}
	const role = new LegacyRole({
		directory: roleData.directory,
		expansion: roleData.expansion,
		identifier: roleData.identifier,
	})
	return {
		mainRole: {
			role,
			...roleData,
		},
		parts: [],
	}
}

export const createRoleInfo = (
	mainRole: CompleteRole<unknown, unknown>,
	...parts: RolePart<unknown, unknown>[]
): RoleInfo => ({
	mainRole: findRoleMetadata(mainRole),
	parts: parts.map((part) => findRoleMetadata(part)),
})
