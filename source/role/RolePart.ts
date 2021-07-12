import capitaliseFirstLetter from "../auxils/capitaliseFirstLetter"
import { CommandProperties, RoleCommand } from "../commands/CommandType"
import { KillCircumstances } from "../systems/game_templates/Game"
import Player, { PlayerStats } from "../systems/game_templates/Player"
import { MergedRole } from "./MergedRole"
import { RoleDescriptor } from "./RoleDescriptor"

export const formatAlignment = (alignment: Alignment): string => {
	if (alignment.representation === null) {
		return ""
	}
	if (alignment.representation) {
		return alignment.representation
	}
	return capitaliseFirstLetter(alignment.id)
}

export interface Alignment {
	id: "town" | "mafia" | "3p" | string
	representation?: string | null
}

export interface RoutineProperties {
	ALLOW_DEAD: boolean
	ALLOW_NIGHT: boolean
	ALLOW_DAY: boolean
}

export interface PartialRoleProperties {
	alignment?: Alignment
	investigation?: string
	alignmentInvestigation?: string
	credits?: string[]
	stats?: Partial<PlayerStats>
}

export interface RolePart<T, S> {
	readonly config: T
	readonly state: S

	readonly commands: CommandProperties<RoleCommand>[]

	readonly properties: PartialRoleProperties

	formatDescriptor(descriptor: RoleDescriptor): void

	/**
	 * Generate the role card
	 */
	getRoleCard?: () => Promise<Buffer | undefined>

	readonly routineProperties: RoutineProperties

	onRoleStart(role: MergedRole): Promise<void>

	onRoutines(player: Player): Promise<void>
	onStart(player: Player): Promise<void>

	onDeath(player: Player, circumstances: KillCircumstances): Promise<void>
	onSubstitute(player: Player): Promise<void>

	broadcastActionMessage(from: Player, message: string): Promise<void>

	postAdditionalRoleInformation(player: Player): Promise<void>
}
