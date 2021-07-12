import { Message } from "discord.js"
import pettyFormat from "../../../../auxils/pettyFormat"
import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import { BasicRolePart, RoutineProperties } from "../../../../role"
import { Actionable } from "../../../../systems/game_templates/Actions"
import Game from "../../../../systems/game_templates/Game"
import Player from "../../../../systems/game_templates/Player"
import RemovableAction from "../RemovableAction"
import { createRealCommand, TargetableRoleCommand } from "./command"
import {
	ITargetableRolePart,
	PlayerTargets,
	RolePeriodUse,
	RoleUsePeriod,
	ShotsData,
	TargetableRoleConfig,
	TargetableRoleState,
} from "./types"

export default abstract class TargetableRolePart<T extends TargetableRoleConfig, S extends TargetableRoleState>
	extends BasicRolePart<T, S>
	implements ITargetableRolePart<T, S>, RemovableAction
{
	readonly targetCommand: TargetableRoleCommand

	readonly commands: CommandProperties<RoleCommand>[]

	constructor(config: T, state: S, targetCommand: TargetableRoleCommand) {
		super(config, state)
		this.targetCommand = targetCommand
		this.commands = [createRealCommand(targetCommand, this)]
	}

	get routineProperties(): RoutineProperties {
		return {
			ALLOW_DAY: true,
			ALLOW_DEAD: false,
			ALLOW_NIGHT: true,
		}
	}

	override async onRoutines(player: Player): Promise<void> {
		if (!this.canUseOnPeriod(player.getGame())) {
			return
		}
		this.state.targets.push(null)
		if (!this.hasRemainingShots()) {
			return
		}

		const game = player.getGame()
		const {
			actionVerb,
			command: { emoji, name: commandName },
		} = this.targetCommand
		const { "command-prefix": commandPrefix } = game.config

		await game.sendPeriodPin(
			player.getPrivateChannel(),
			`${emoji} You may ${actionVerb} a player ${
				game.isDay() ? "today" : "tonight"
			}.\n\nUse \`${commandPrefix}${commandName} <player | nobody> to select your target\`.`
		)
	}

	getRoleDetails(): string[] {
		const details: string[] = []
		if (this.sameTargetCooldown > 0) {
			details.push(this.formatCooldown())
		}
		if (Number.isFinite(this.totalShots.shots)) {
			details.push(this.formatShots())
		}
		return details
	}

	formatShots(): string {
		const { shots, singularText, pluralText } = this.totalShots
		if (!Number.isFinite(shots)) return ""
		else if (shots == 1) return `You have 1 ${singularText}`
		else return `You have ${shots} ${pluralText}`
	}

	formatCooldown(): string {
		const use = this.periods
		const cooldown = this.sameTargetCooldown
		if (use.type === "on" && (use.on === RoleUsePeriod.NIGHT || use.on === RoleUsePeriod.DAY)) {
			const period = use.on === RoleUsePeriod.NIGHT ? "nights" : "days"
			if (cooldown == 1) return `You may not target the same player on consecutive ${period}`
			else return `You may only target the same player again after ${cooldown} ${period}`
		}
		const inARow = cooldown + 1
		if (inARow === 2) return "You may not target the same player twice in a row"
		else return `You may not target the same player ${inARow} times in a row`
	}

	formatPeriodDescription(): string {
		const use = this.periods
		switch (use.type) {
			case "on": {
				switch (use.on) {
					case RoleUsePeriod.BOTH:
						return "During either the day or night"
					case RoleUsePeriod.DAY:
						return "During the day"
					case RoleUsePeriod.NIGHT:
						return "During the night"
				}
				break
			}
			case "even":
			case "odd": {
				switch (use.on) {
					case RoleUsePeriod.BOTH:
						return `On ${use.type} days & nights`
					case RoleUsePeriod.DAY:
						return `On ${use.type} days`
					case RoleUsePeriod.NIGHT:
						return `On ${use.type} nights`
				}
				break
			}

			case "specific_periods": {
				const format = (type: string, periods: number[]) => {
					if (periods.length == 1) return `${type} ${periods[0]}`
					else return `${type}s ${pettyFormat(periods.map((p) => p.toString()))}`
				}
				const parts = []
				if (use.days.length > 0) {
					parts.push(format("day", use.days))
				}
				if (use.nights.length > 0) {
					if (parts.length > 0) {
						parts.push("and")
					}
					parts.push(format("night", use.nights))
				}
				return "On " + parts.join(" ")
			}
		}
	}

	canUseOnPeriod(game: Game): boolean {
		const periods = this.periods
		switch (periods.type) {
			case "on": {
				const on = periods.on
				if (on === RoleUsePeriod.BOTH) return game.isDay() || game.isNight()
				else if (on === RoleUsePeriod.NIGHT) return game.isNight()
				else if (on === RoleUsePeriod.DAY) return game.isDay()
				break
			}
			case "even": {
				const on = periods.on
				const remainder = game.getPeriod() % 4
				if (on === RoleUsePeriod.BOTH) return remainder === 0 || remainder === 3
				else if (on === RoleUsePeriod.DAY) return remainder === 0
				else if (on === RoleUsePeriod.NIGHT) return remainder === 3
				break
			}
			case "odd": {
				const on = periods.on
				const remainder = game.getPeriod() % 4
				if (on === RoleUsePeriod.BOTH) return remainder === 2 || remainder === 1
				else if (on === RoleUsePeriod.DAY) return remainder === 2
				else if (on === RoleUsePeriod.NIGHT) return remainder === 1
				break
			}
			case "specific_periods": {
				const dayPeriods = periods.days.map((day) => day * 2)
				const nightPeriods = periods.nights.map((night) => night * 2 + 1)

				return [...dayPeriods, ...nightPeriods].includes(game.getPeriod())
			}
		}
		throw new Error(`Illegal state, unknown period type '${periods.type}'`)
	}

	hasRemainingShots(): boolean {
		return !Number.isFinite(this.totalShots.shots) || this.shotsUsed < this.totalShots.shots
	}

	get periods(): RolePeriodUse {
		return (
			this.config.periods || {
				type: "on",
				on: RoleUsePeriod.NIGHT,
			}
		)
	}

	get sameTargetCooldown(): number {
		return this.config.sameTargetCooldown || 0
	}

	get shotsUsed(): number {
		return this.state.shotsUsed
	}

	get totalShots(): ShotsData {
		return (
			this.config.shots || {
				shots: Infinity,
				singularText: "shot",
				pluralText: "shots",
			}
		)
	}

	get targets(): PlayerTargets {
		return this.state.targets
	}

	getExistingAction(from: Player): Actionable<unknown> | null {
		return this.targetCommand.getCurrentAction(from.getGame(), from)
	}

	async deselectExistingAction(from: Player, message: Message): Promise<void> {
		if (this.getExistingAction(from) != null) {
			const targets = this.targets
			if (targets.length > 0) {
				targets[targets.length - 1] = null
			}
		}
		await this.targetCommand.deselectCurrentAction(from.getGame(), message, from)
	}
}
