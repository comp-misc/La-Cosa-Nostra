import { RoleActionable } from "../../../../../systems/actionables"

const onKilled: RoleActionable = async (actionable, game) => {
	const killActions = game.actions.findAll(
		(action) => action.identifier.endsWith("/kill") && action.to === actionable.to
	)
	for (const killAction of killActions) {
		const killer = game.getPlayerOrThrow(killAction.from)
		await game.kill(killer, "__kill__", "killed", undefined, {
			attacker: actionable.target,
		})
	}
}

export default onKilled
