import Player from "../systems/game_templates/Player"
import { CompleteRole } from "./CompleteRole"
import { RoleMetadata } from "./RoleMetadata"
import { RolePart, RoutineProperties } from "./RolePart"

export * from "./BasicCompleteRole"
export * from "./BasicRolePart"
export * from "./CompleteRole"
export * from "./MergedRole"
export * from "./RoleConstructor"
export * from "./RoleDescriptor"
export * from "./RoleMetadata"
export * from "./RolePart"
export * from "./LegacyRole"
export * from "./loadRoles"

export type RoleStart = (player: Player) => void | Promise<void>

export interface RoleRoutine extends RoutineProperties {
	(player: Player): void
}

export const createRoutines = (
	func: (player: Player) => void | Promise<void>,
	properties: RoutineProperties
): RoleRoutine => {
	const routine: RoleRoutine = (player: Player) => func(player)
	routine.ALLOW_DAY = properties.ALLOW_DAY
	routine.ALLOW_NIGHT = properties.ALLOW_NIGHT
	routine.ALLOW_DEAD = properties.ALLOW_DEAD
	return routine
}

export interface RoleInfo {
	mainRole: RoleMetadata<CompleteRole<unknown, unknown>>
	parts: RoleMetadata<RolePart<unknown, unknown>>[]
}
