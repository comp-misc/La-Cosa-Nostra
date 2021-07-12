import { CompleteRole } from "./CompleteRole"
import { RoleConstructor } from "./RoleConstructor"
import { RolePart } from "./RolePart"

export interface RoleMetadata<R extends RolePart<unknown, unknown>> {
	type: "part" | "complete" | "legacy"
	identifier: string
	expansion: string
	directory: string
	role: R
}

interface LoadedRolePart {
	type: "part"
	constructor: RoleConstructor<RolePart<unknown, unknown>, unknown, unknown>
}

interface LoadedCompleteRole {
	type: "complete" | "legacy"
	constructor: RoleConstructor<CompleteRole<unknown, unknown>, unknown, unknown>
}

export type LoadedRoleMetadata = (LoadedRolePart | LoadedCompleteRole) & {
	identifier: string
	expansion: string
	directory: string
}
