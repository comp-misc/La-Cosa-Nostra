import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import { ProgrammableRole, RoleProperties, RoutineProperties } from "../../../../systems/Role"
import roleProperties from "./role.json"
import Player from "../../../../systems/game_templates/Player"
import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import fs from "fs"
import unoOn from "./commands/unoOn"
import unoOff from "./commands/unoOff"

const DESCRIPTION = `
Welcome to \${game.name}! You are a Town no u.

Role Abilities:
- During the night, you may play a reverse Uno card. Any attempts on your life will backfire, killing the assailant.
  You will use your ability regardless of whether you were targetted.
- You have \${uses}

Win Condition: You win when all threats to town have been eliminated and there is at least one member of town left.
`.trim()

export interface NoUConfig {
	maximumUses: number
	uses?: number
}

export default class TownNoU implements ProgrammableRole<NoUConfig> {
	readonly config: NoUConfig
	readonly properties: RoleProperties = roleProperties
	readonly commands: CommandProperties<RoleCommand>[] = [unoOn, unoOff]

	constructor(config: NoUConfig) {
		this.config = config
	}

	getDescription(): string {
		return DESCRIPTION.replace(
			"${uses}",
			this.config.maximumUses === 1 ? "1 use" : `${this.config.maximumUses} uses`
		)
	}

	async onStart(player: Player): Promise<void> {
		await player.getGame().addAction("town_no_u/roleblocked", ["roleblock"], {
			from: player,
			to: player,
			expiry: Infinity,
			tags: ["permanent"],
			priority: ActionPriorities.HIGH,
		})
	}

	async onRoutines(player: Player): Promise<void> {
		if (this.getUses() >= this.config.maximumUses) {
			return
		}
		const config = player.getGame().config
		const channel = player.getPrivateChannel()

		await player
			.getGame()
			.sendPeriodPin(
				channel,
				":flower_playing_cards: You may deploy a reverse uno card tonight.\n\nUse `" +
					config["command-prefix"] +
					"uno-on` or `" +
					config["command-prefix"] +
					"uno-off` to enable/disable"
			)
	}

	getUses(): number {
		return this.config.uses || 0
	}

	onUse(): void {
		this.config.uses = this.getUses() + 1
	}

	getRoleCard(): Promise<Buffer> {
		return new Promise((resolve, reject) =>
			fs.readFile(__dirname + "/card.png", {}, (err, data) => {
				if (err) reject(err)
				else resolve(data)
			})
		)
	}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DAY: false,
		ALLOW_DEAD: false,
		ALLOW_NIGHT: true,
	}
}
