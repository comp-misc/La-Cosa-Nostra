import { Actionable, ExecutionParams } from "../../systems/game_templates/Actions"
import Game from "../../systems/game_templates/Game"

export default interface AttackPrototype {
	<T>(
		actionable: Actionable<T>,
		game: Game,
		_params?: ExecutionParams,
		astral?: boolean,
		broadcast_offset?: number
	): Promise<boolean>

	reason: string
	secondary_reason?: string
}
