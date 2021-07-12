import fs from "fs"
import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import { BasicRolePart, PartialRoleProperties, RoleDescriptor, RoutineProperties } from "../../../../role"
import Player from "../../../../systems/game_templates/Player"
import unoOff from "./commands/unoOff"
import unoOn from "./commands/unoOn"

export interface Config {
	maximumUses: number
}

export interface State {
	uses: number
}

export default class NoU extends BasicRolePart<Config, State> {
	readonly commands: CommandProperties<RoleCommand>[] = [unoOn, unoOff]
	readonly properties: PartialRoleProperties = {
		investigation: "No U",
	}

	constructor(config: Config, state?: State) {
		super(config, state || { uses: 0 })
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "No U"
		descriptor.addDescription(RoleDescriptor.CATEGORY.ROLE_ABILITIES, {
			name: "Reverse UNO",
			description:
				"During the night, you may play a reverse Uno card. Any attempts on your life will backfire, killing the assailant",
			notes: [
				"You will use your ability regardless of whether you were targetted",
				"You have " + (this.config.maximumUses == 1 ? "1 use" : `${this.config.maximumUses} uses`),
			],
		})
	}

	override async onRoutines(player: Player): Promise<void> {
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
		return this.state.uses
	}

	onUse(): void {
		this.state.uses++
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
