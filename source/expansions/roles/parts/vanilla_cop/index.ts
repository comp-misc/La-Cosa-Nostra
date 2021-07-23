import { BasicDescriptionCategory, PartialRoleProperties, RoleDescriptor } from "../../../../role"
import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import Player from "../../../../systems/game_templates/Player"
import TargetableRolePart, { DEFAULT_STATE, TargetableRoleConfig, TargetableRoleState } from "../targetableRolePart"
import investigateCmd from "./investigateCmd"

interface Config extends TargetableRoleConfig {
	/**
	 * Phrase to use to describe "Vanilla". Default "Vanilla"
	 */
	showVanillaAs?: string

	/** Investigation role to match. Default "Vanilla" */
	vanillaRole?: string
}

export default class VanillaCop extends TargetableRolePart<Config, TargetableRoleState> {
	readonly properties: PartialRoleProperties = {
		investigation: "Vanilla Cop",
	}

	constructor(config: Config, state?: TargetableRoleState) {
		super(config, state || DEFAULT_STATE, investigateCmd(config.showVanillaAs || "Vanilla"))
	}

	override async onStart(player: Player): Promise<void> {
		await player.getGame().addAction("vanilla_cop/roleblock_noresult", ["roleblock"], {
			from: player,
			to: player,
			expiry: Infinity,
			tags: ["permanent"],
			priority: ActionPriorities.HIGH,
		})
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Vanilla Cop"
		descriptor.addDescription(BasicDescriptionCategory.ROLE_ABILITIES, {
			name: "Investigate",
			description:
				super.formatPeriodDescription() +
				`, you may choose to investigate a player to determine if they are ${this.showVanillaAs}. ` +
				"You will receive the report next morning.",
			notes: super.getRoleDetails(),
		})
	}

	get showVanillaAs(): string {
		return this.config.showVanillaAs || "Vanilla"
	}

	get vanillaRole(): string {
		return this.config.vanillaRole || "Vanilla"
	}
}
