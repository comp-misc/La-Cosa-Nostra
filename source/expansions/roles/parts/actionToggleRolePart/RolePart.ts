import { Message } from "discord.js"
import pettyFormat from "../../../../auxils/pettyFormat"
import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import { BasicRolePart, RoutineProperties } from "../../../../role"
import { Actionable } from "../../../../systems/game_templates/Actions"
import Game from "../../../../systems/game_templates/Game"
import Player from "../../../../systems/game_templates/Player"
import { ActionToggleRoleCommand, createRealCommand } from "./command"
import {
	ActionToggleRoleConfig,
	ActionToggleRoleState,
	IActionToggleRolePart,
	RolePeriodUse,
	RoleUsePeriod,
} from "./types"

export default abstract class ActionToggleRolePart<
		T extends ActionToggleRoleConfig = ActionToggleRoleConfig,
		S extends ActionToggleRoleState = ActionToggleRoleState
	>
	extends BasicRolePart<T, S>
	implements IActionToggleRolePart<T, S>
{
	readonly toggleCommand: ActionToggleRoleCommand

	readonly commands: CommandProperties<RoleCommand>[]

	constructor(config: T, state: S, toggleCommand: ActionToggleRoleCommand) {
		super(config, state)
		this.toggleCommand = toggleCommand
		this.commands = [createRealCommand(toggleCommand, this)]
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
		this.state.periodsUsedAction.push(false)
		if (!this.hasRemainingShots()) {
			return
		}

		const game = player.getGame()
		const channel = player.getPrivateChannel()

		const {
			actionVerb,
			command: { emoji, name: commandName },
		} = this.toggleCommand
		const { "command-prefix": commandPrefix } = game.config

		await game.sendPeriodPin(
			channel,
			`${emoji} You may use your ${actionVerb} action${
				game.isDay() ? "today" : "tonight"
			}.\n\nUse \`${commandPrefix}${commandName} <on | off>\` to toggle on and off.`
		)
	}

	getRoleDetails(): string[] {
		const details: string[] = []
		if (Number.isFinite(this.startingShots)) {
			details.push(this.formatShots())
		}
		return details
	}

	formatShots(): string {
		const shots = this.startingShots
		const configShots = this.config.shots
		const { singularText = "shot", pluralText = "shots" } =
			configShots && typeof configShots !== "number" ? configShots : {}

		if (!Number.isFinite(shots)) return ""
		else if (shots == 1) return `You have 1 ${singularText}`
		else return `You have ${shots} ${pluralText}`
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
		const startingShots = this.startingShots
		return !Number.isFinite(startingShots) || this.shotsUsed < startingShots
	}

	get periods(): RolePeriodUse {
		return (
			this.config.periods || {
				type: "on",
				on: RoleUsePeriod.NIGHT,
			}
		)
	}

	get startingShots(): number {
		const shots = this.config.shots
		if (shots === undefined) {
			return Infinity
		}
		if (typeof shots === "number") {
			return shots
		}
		return shots.shots
	}

	get shotsUsed(): number {
		return this.state.shotsUsed
	}

	getExistingAction(from: Player): Actionable<unknown> | null {
		return this.toggleCommand.getCurrentAction(from.getGame(), from)
	}

	async deselectExistingAction(from: Player, message: Message): Promise<void> {
		if (this.getExistingAction(from) != null) {
			const { periodsUsedAction } = this.state
			if (periodsUsedAction.length > 0) {
				periodsUsedAction[periodsUsedAction.length - 1] = false
			}
		}
		await this.toggleCommand.deselectCurrentAction(from.getGame(), message, from)
	}

	//TODO Keep track of how many shots have been used
}
