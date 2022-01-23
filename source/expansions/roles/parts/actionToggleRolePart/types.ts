import { RolePart } from "../../../../role"
import Game from "../../../../systems/game_templates/Game"
import RemovableAction, { ExclusiveActionConfig } from "../RemovableAction"
import { ActionToggleRoleCommand } from "./command"

export interface IActionToggleRolePart<T extends ActionToggleRoleConfig, S extends ActionToggleRoleState>
	extends RolePart<T, S>,
		RemovableAction {
	readonly toggleCommand: ActionToggleRoleCommand

	getRoleDetails(): string[]

	formatShots(): string
	formatPeriodDescription(): string

	canUseOnPeriod(game: Game): boolean
	hasRemainingShots(): boolean

	periods: RolePeriodUse
	shotsUsed: number
}

export interface ShotsData {
	/**
	 * The number of uses of the role the player has.
	 */
	shots: number
	singularText?: string
	pluralText?: string
}

export interface ActionToggleRoleConfig extends ExclusiveActionConfig {
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

export interface ActionToggleRoleState {
	shotsUsed: number
	periodsUsedAction: boolean[]
}
