import { WinCondition } from "../systems/win_conditions"
import { Alignment, PartialRoleProperties, RolePart } from "./RolePart"

export interface CompleteRoleProperties extends PartialRoleProperties {
	alignment: Alignment
}

export interface CompleteRole<T, S> extends RolePart<T, S> {
	properties: CompleteRoleProperties
	winCondition: WinCondition
}
