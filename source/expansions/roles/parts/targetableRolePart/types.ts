import { RolePart } from "../../../../role"
import Game from "../../../../systems/game_templates/Game"
import { PlayerIdentifier } from "../../../../systems/game_templates/Player"
import RemovableAction, { ExclusiveActionConfig } from "../RemovableAction"
import { TargetableRoleCommand } from "./command"

export interface ITargetableRolePart<T extends TargetableRoleConfig, S extends TargetableRoleState>
	extends RolePart<T, S>,
		RemovableAction {
	readonly targetCommand: TargetableRoleCommand

	getRoleDetails(): string[]

	formatShots(): string
	formatCooldown(): string
	formatPeriodDescription(): string

	canUseOnPeriod(game: Game): boolean
	hasRemainingShots(): boolean

	periods: RolePeriodUse
	sameTargetCooldown: number
	shotsUsed: number
	targets: PlayerTargets
}

export interface ShotsData {
	/**
	 * The number of uses of the role the player has.
	 */
	shots: number
	singularText?: string
	pluralText?: string
}

export interface TargetableRoleConfig extends ExclusiveActionConfig {
	/**
	 * The number of possible use periods (based on the 'use' property) the role has to wait to be able to use their action on the same player again.
	 * 0 => No cooldown, can target the same player on consecutive nights
	 * 1 => Only can target the same player on non-consecutive nights
	 *
	 * Default no cooldown (0)
	 */
	sameTargetCooldown?: number

	/**
	 * The number of uses of the role the player has. Default unlimited
	 */
	shots?: ShotsData | number

	/**
	 * When the player can use their role. Default only nights
	 */
	periods?: RolePeriodUse
}

export type RolePeriodUse = RoleUseSpecific | RoleUseEven | RoleUseOdd | RoleUseOn

export interface RoleUseSpecific {
	type: "specific_periods"
	days: number[]
	nights: number[]
}

export interface RoleUseEven {
	type: "even"
	on: RoleUsePeriod
}

export interface RoleUseOdd {
	type: "odd"
	on: RoleUsePeriod
}

export interface RoleUseOn {
	type: "on"
	on: RoleUsePeriod
}

export enum RoleUsePeriod {
	DAY = "day",
	NIGHT = "night",
	BOTH = "both",
}

export type PlayerTargets = (PlayerIdentifier | null)[]

export interface TargetableRoleState {
	targets: PlayerTargets
	shotsUsed: number
}
