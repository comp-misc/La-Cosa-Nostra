import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import Player from "../../../../systems/game_templates/Player"
import { ProgrammableRole, RoleProperties, RoutineProperties } from "../../../../systems/Role"
import roleProperties from "./role.json"
import shootCmd from "./commands/shoot"

const DESCRIPTION = `
Welcome to \${game.name}! You are a Town Marksman.

You love guns. A lot. So much, you smuggled your beloved Sten gun MK II past customs and border control.

Role Abilities:
- During the day, you may shoot a player. All players will see this action, including you as the perpetrator. Acts as a regular kill.
- You have \${bullets}

Win Condition: You win when all threats to town have been eliminated and there is at least one member of town left.
`.trim()

export interface TownMarksmanConfig {
	killProbability: number
	missProbability: number
	selfInflictProbability: number
	bullets: number
	bulletsShot?: number
}

export default class CrimeSceneInvestigator implements ProgrammableRole<TownMarksmanConfig> {
	readonly config: TownMarksmanConfig
	readonly properties: RoleProperties = roleProperties
	readonly commands: CommandProperties<RoleCommand>[] = [shootCmd]

	constructor(config: TownMarksmanConfig) {
		this.config = config
	}

	getDescription(): string {
		return DESCRIPTION.replace(
			"${bullets}",
			this.config.bullets === 1 ? "1 bullet" : `${this.config.bullets} bullets`
		)
	}

	onStart(): void {
		this.config.bulletsShot = 0
	}

	async onRoutines(player: Player): Promise<void> {
		if (this.getBulletsShot() < this.config.bullets) {
			const config = player.getGame().config

			const channel = player.getPrivateChannel()
			await player
				.getGame()
				.sendPeriodPin(
					channel,
					":gun: You may shoot someone today.\n\nUse: `" +
						config["command-prefix"] +
						"shoot <target>` to select your target"
				)
		}
	}

	getBulletsShot(): number {
		return this.config.bulletsShot || 0
	}

	addBulletShot(): void {
		this.config.bulletsShot = this.getBulletsShot() + 1
	}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DAY: true,
		ALLOW_DEAD: false,
		ALLOW_NIGHT: false,
	}
}
