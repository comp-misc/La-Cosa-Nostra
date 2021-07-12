import { BasicDescriptionCategory, PartialRoleProperties, RoleDescriptor } from "../../../../role"
import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import Player from "../../../../systems/game_templates/Player"
import TargetableRolePart, { DEFAULT_STATE, TargetableRoleConfig, TargetableRoleState } from "../targetableRolePart"
import investigateCmd from "./investigateCmd"

interface Config extends TargetableRoleConfig {
	/**
	 * Custom responses to use per alignment. Otherwise, echo back the role alignment
	 */
	alignmentResponses?: Record<string, string>

	/**
	 * Response to give when the target is investigation immune. Default 'Town'
	 */
	investigationImmuneResponse?: string
}

export default class AlignmentCop extends TargetableRolePart<Config, TargetableRoleState> {
	readonly properties: PartialRoleProperties = {
		investigation: "Alignment Cop",
	}

	constructor(config: Config, state?: TargetableRoleState) {
		super(config, state || DEFAULT_STATE, investigateCmd)
	}

	override async onStart(player: Player): Promise<void> {
		await player.getGame().addAction("alignment_cop/roleblock_noresult", ["roleblock"], {
			from: player,
			to: player,
			expiry: Infinity,
			tags: ["permanent"],
			priority: ActionPriorities.HIGH,
		})
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Alignment Cop"
		descriptor.addDescription(BasicDescriptionCategory.ROLE_ABILITIES, {
			name: "Investigate",
			description:
				super.formatPeriodDescription() +
				", you may choose to investigate a player to determine their alignment. You will receive the report next morning.",
			notes: super.getRoleDetails(),
		})
	}
}
