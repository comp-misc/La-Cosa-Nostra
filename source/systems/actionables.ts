import { Actionable, ActionableTag, ExecutionParams } from "./game_templates/Actions"
import Game from "./game_templates/Game"

export interface RoleActionable<T = unknown> {
	(actionable: Actionable<T>, game: Game, params?: ExecutionParams): void | boolean | Promise<void> | Promise<boolean>
	TAGS?: ActionableTag[]
}
