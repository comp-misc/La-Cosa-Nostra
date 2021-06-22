/* eslint-disable @typescript-eslint/no-empty-function */
import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import Player from "../../../../systems/game_templates/Player"
import { ProgrammableRole, RoleProperties, RoutineProperties } from "../../../../systems/Role"
import roleProperties from "./role.json"
import investigateCmd from "./commands/investigate"

const DESCRIPTION = `
Welcome to \${game.name}! You are a Crime Scene Investigator.

Role Abilities:
- During the day, you may investigate the death of a player. 
- You will receive a report the following night detailing \${totalSuspects}.
- At least one of these suspects is guaranteed to be the killer
- You have \${uses}

Win Condition: You win when all threats to town have been eliminated and there is at least one member of town left.
`.trim()

export interface CrimeSceneInvestigatorConfig {
	maximumUses: number
	totalSuspects: number
	uses?: number
}

export default class CrimeSceneInvestigator implements ProgrammableRole<CrimeSceneInvestigatorConfig> {
	readonly config: CrimeSceneInvestigatorConfig
	readonly properties: RoleProperties = roleProperties
	readonly commands: CommandProperties<RoleCommand>[] = [investigateCmd]

	constructor(config: CrimeSceneInvestigatorConfig) {
		this.config = config
	}

	getDescription(): string {
		return DESCRIPTION.replace("${totalSuspects}", `${this.config.totalSuspects} potential suspects`).replace(
			"${uses}",
			this.config.maximumUses === 1 ? "1 use" : `${this.config.maximumUses} uses`
		)
	}

	onStart(): void {
		this.config.uses = 0
	}

	getUses(): number {
		return this.config.uses || 0
	}

	async onRoutines(player: Player): Promise<void> {
		if (this.getUses() < this.config.maximumUses && player.getGame().isDay()) {
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
	}

	revealSuspects(player: Player, suspects: Player[]): void {
		this.config.uses = (this.config.uses || 0) + 1
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

	readonly routineProperties: RoutineProperties = {
		ALLOW_DAY: true,
		ALLOW_DEAD: false,
		ALLOW_NIGHT: true,
	}
}
