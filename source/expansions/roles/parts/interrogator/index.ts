import { BasicDescriptionCategory, PartialRoleProperties, RoleDescriptor } from "../../../../role"
import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import Player from "../../../../systems/game_templates/Player"
import TargetableRolePart, { DEFAULT_STATE, TargetableRoleConfig, TargetableRoleState } from "../targetableRolePart"
import interrogate from "./interrogateCmd"

export default class Interrogator extends TargetableRolePart<TargetableRoleConfig, TargetableRoleState> {
	readonly properties: PartialRoleProperties = {
		investigation: "Interrogator",
	}

	constructor(config: TargetableRoleConfig, state?: TargetableRoleState) {
		super(config, state || DEFAULT_STATE, interrogate)
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Interrogator"
		descriptor.addDescription(BasicDescriptionCategory.ROLE_ABILITIES, {
			name: "Interrogate",
			description: super.formatPeriodDescription() + ", you may choose to interrogate a player the following day",
			notes: ["Opens a shared private channel for the duration of the following day", ...super.getRoleDetails()],
		})
	}

	override async onStart(player: Player): Promise<void> {
		await player.getGame().addAction("interrogator/roleblocked", ["roleblock"], {
			from: player,
			to: player,
			expiry: Infinity,
			tags: ["permanent"],
			priority: ActionPriorities.HIGH,
		})
	}
}
