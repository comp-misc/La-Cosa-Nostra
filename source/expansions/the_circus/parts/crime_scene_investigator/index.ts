import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import {
	BasicDescriptionCategory,
	BasicRolePart,
	PartialRoleProperties,
	RoleDescriptor,
	RoutineProperties,
} from "../../../../role"
import Player from "../../../../systems/game_templates/Player"
import investigateCmd from "./investigateCmd"

export interface Config {
	uses: number
	totalSuspects: number
}

export interface State {
	uses: number
}

export default class CrimeSceneInvestigator extends BasicRolePart<Config, State> {
	readonly commands: CommandProperties<RoleCommand>[] = [investigateCmd]
	readonly properties: PartialRoleProperties = {
		investigation: "Crime Scene Investigator",
	}

	constructor(config: Config, state?: State) {
		super(config, state || { uses: 0 })
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Crime Scene Investigator"
		descriptor.addDescription(BasicDescriptionCategory.ROLE_ABILITIES, {
			name: "Investigate",
			description: "During the day, you may investigate the death of a player",
			notes: [
				`You will receive a report the following night detailing ${this.config.totalSuspects} potential suspects`,
				"At least one of these suspects is guaranteed to be the killer",
				"You have " + (this.config.uses == 1 ? "1 use" : `${this.config.uses} uses`),
			],
		})
	}

	revealSuspects(player: Player, suspects: Player[]): void {
		this.state.uses++
		const suspectsNames = suspects.map((suspect) => "**" + suspect.getDisplayName() + "**")
		if (suspectsNames.length === 0) {
			return
		}
		player
			.getGame()
			.addMessage(
				player,
				":mag_right: After careful examination of the evidence, you narrow down your list of suspects to the following players: " +
					suspectsNames.join(", ")
			)
	}

	override async onRoutines(player: Player): Promise<void> {
		if (this.getUses() >= this.config.uses) {
			return
		}
		const config = player.getGame().config

		const channel = player.getPrivateChannel()
		await player
			.getGame()
			.sendPeriodPin(
				channel,
				":mag_right: You may choose to investigate a death today.\n\nUse: `" +
					config["command-prefix"] +
					"investigate <player>` to investigate a death"
			)
	}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DAY: true,
		ALLOW_DEAD: false,
		ALLOW_NIGHT: false,
	}

	getUses(): number {
		return this.state.uses
	}
}
