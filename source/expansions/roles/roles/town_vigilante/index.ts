import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import Player from "../../../../systems/game_templates/Player"
import { ProgrammableRole, RoleProperties, RoutineProperties } from "../../../../systems/Role"
import killCmd from "./commands/kill"
import roleProperties from "./role.json"

export interface TownVigilanteConfig {
	/** When the role can attempt a kill */
	stages: KillStage[]

	/** If defined, the role has only this number of kill attempts */
	shots?: number
}

export enum KillStage {
	DAY = "day",
	NIGHT = "night",
	EVEN_NIGHT = "even_night",
}

const DESCRIPTION = `
Welcome to \${game.name}! You are a Town Vigilante.

Role Abilities:
- You may choose to kill a player \${stagesDescription}

Win Condition: You win when all threats to town have been eliminated and there is at least one member of town left.
`.trim()

export default class TownVigilante implements ProgrammableRole<TownVigilanteConfig> {
	readonly config: TownVigilanteConfig
	readonly properties: RoleProperties = roleProperties
	readonly commands: CommandProperties<RoleCommand>[] = [killCmd]
	readonly routineProperties: RoutineProperties

	constructor(config: TownVigilanteConfig) {
		this.config = config

		if (config.stages.length === 0) {
			throw new Error("Must specify at least one stage, or the role will be unable to use their ability")
		}
		if (config.shots) {
			if (config.shots <= 0) throw new Error("If specified, shots must be > 0")
			if (!Number.isInteger(config.shots)) throw new Error("If specified, shots must be an integer")
		}
		this.routineProperties = {
			ALLOW_DAY: true,
			ALLOW_NIGHT: true,
			ALLOW_DEAD: false,
		}
	}

	getDescription(): string {
		return DESCRIPTION.replace("${stagesDescription}", this.formatStages())
	}

	onStart(player: Player): void {
		if (this.config.shots) {
			player.misc.killShotsLeft = this.config.shots
		}
	}

	async onRoutines(player: Player): Promise<void> {
		if (player.misc.vigUsed && this.config.shots) {
			player.misc.vigUsed = false
			player.misc.killShotsLeft--
		}
		// Nighttime actions
		const game = player.getGame()
		if (game.isDay() && this.config.stages.includes(KillStage.DAY)) {
			await this.showKillCommand(player, "today")
		} else if (
			!game.isDay() &&
			(this.config.stages.includes(KillStage.NIGHT) || this.config.stages.includes(KillStage.EVEN_NIGHT))
		) {
			await this.showKillCommand(player, "tonight")
		}
	}

	private async showKillCommand(player: Player, when: string) {
		const config = player.getGame().config
		const channel = player.getPrivateChannel()

		if (!this.canUseKill(player)) {
			await player.getGame().sendPeriodPin(channel, `:dagger: You may not kill a player ${when}.`)
			return
		}
		await player
			.getGame()
			.sendPeriodPin(
				channel,
				":dagger:  You may choose to kill a player " + when + ".\n\n" + killCmd.formatUsageDescription(config)
			)
	}

	isOutOfShots(player: Player): boolean {
		return !!this.config.shots && player.misc.killShotsLeft <= 0
	}

	canUseKill(player: Player): boolean {
		if (this.isOutOfShots(player)) {
			return false
		}
		return this.config.stages.every((stage) => TownVigilante.canUseKillOnStage(player, stage))
	}

	static decrementShotsLeft(player: Player): void {
		player.misc.killShotsLeft--
	}

	static canUseKillOnStage(player: Player, stage: KillStage): boolean {
		const game = player.getGame()
		switch (stage) {
			case KillStage.DAY:
				return game.isDay()
			case KillStage.NIGHT:
				return !game.isDay()
			case KillStage.EVEN_NIGHT:
				return game.getPeriod() % 4 === 3
		}
	}

	private formatStages(): string {
		const { stages } = this.config
		let result = ""
		for (let i = 0; i < stages.length; i++) {
			if (i === stages.length - 2) result += " or "
			else if (i != 0) result += ", "
			result += this.formatStage(stages[i])
		}
		return result
	}

	private formatStage(stage: KillStage): string {
		switch (stage) {
			case KillStage.DAY:
				return "during the day"
			case KillStage.NIGHT:
				return "during the night"
			case KillStage.EVEN_NIGHT:
				return "on even nights"
		}
	}
}
