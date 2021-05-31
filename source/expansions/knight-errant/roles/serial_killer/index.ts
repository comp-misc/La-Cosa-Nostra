import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import { SetupAttributeData } from "../../../../LcnConfig"
import Player from "../../../../systems/game_templates/Player"
import { ProgrammableRole, RoleProperties, RoutineProperties } from "../../../../systems/Role"
import roleProperties from "./role.json"

import killCmd from "./commands/kill"
import listAbilitiesCmd from "./commands/listAbilities"
import strongKillCmd from "./commands/strongKill"

const description = `
Welcome to \${game.name}! You are a Serial Killer.

Abilities:
- Kill: Each night phase, you may target another player in the game to attempt to kill them.
- Strong Kill: Once, at night, instead of using your normal kill, you may target a player to deal an unstoppable kill on them.
- Limited-Use Abilities: You are granted special limited-use abilities at the start of the game depending on the role distribution which you may use accordingly in conjunction with the kill.

Win condition:
- You win when you are the last player alive, or that is inevitable.

`.trim()

export interface SerialKillerConfig {
	abilities: SetupAttributeData[]
}

export default class SerialKiller implements ProgrammableRole<SerialKillerConfig> {
	readonly config: SerialKillerConfig
	readonly properties: RoleProperties = roleProperties

	readonly commands: CommandProperties<RoleCommand>[]

	constructor(config: SerialKillerConfig) {
		this.config = config
		this.commands = [killCmd, listAbilitiesCmd, strongKillCmd]
	}

	getDescription(): string {
		return description
	}

	async onStart(player: Player): Promise<void> {
		for (const ability of this.config.abilities) {
			await player.addAttribute(ability.identifier, ability.expiry, ability.tags)
		}

		const config = player.getGame().config
		const prefix = config["command-prefix"]

		player.addIntroMessage(
			":zap: This is a directory for limited-use abilities:\n\n:one: `" +
				prefix +
				"ability <ability name>`: provides the information associated with a limited-use ability.\n:two: `" +
				prefix +
				"listabilities`: lists all the **non-passive** limited-use abilities you have at the time of execution. May only be run in your private channel."
		)

		player.misc.can_pick = true

		const abilities = player.attributes.filter(
			(x) =>
				x.attribute.modular &&
				x.attribute["modular-details"] &&
				x.attribute["modular-details"].cluster === "ability"
		)

		abilities.sort((a, b) => a.tags.uses - b.tags.uses)

		if (abilities.length > 0) {
			const abilityNames = abilities.map((x, i) => `${i + 1}. ${x.attribute.name} [x ${x.tags.uses as number}]`)
			player.addIntroMessage(
				":exclamation: You currently have the following limited-use abilities (both **non-passive** and **passive**):\n\n```fix\n" +
					abilityNames.join("\n") +
					"\n```\nTo obtain information on a power and how to use it, use `!ability <power name>`."
			)
		} else {
			player.addIntroMessage(
				":exclamation: You have no limited-use abilities (both **non-passive** and **passive**)."
			)
		}

		player.misc.strongkills_left = 1
	}

	async onRoutines(player: Player): Promise<void> {
		const config = player.getGame().config

		// Nighttime actions
		const channel = player.getPrivateChannel()

		if (player.misc.strongkills_left > 0) {
			await player
				.getGame()
				.sendPeriodPin(
					channel,
					":no_entry: You may choose to kill a player tonight.\n\nUse `" +
						config["command-prefix"] +
						"kill <alphabet/name/nobody>` to select your target for a normal kill or `" +
						config["command-prefix"] +
						"strongkill <alphabet/name/nobody>` to use your strong kill."
				)
		} else {
			await player
				.getGame()
				.sendPeriodPin(
					channel,
					":no_entry: You may choose to kill a player tonight.\n\nUse `" +
						config["command-prefix"] +
						"kill <alphabet/name/nobody>` to select your target."
				)
		}

		const abilities = player.attributes.filter(
			(x) =>
				x.attribute.modular &&
				x.attribute["modular-details"] &&
				x.attribute["modular-details"].cluster === "ability"
		)

		abilities.sort((a, b) => a.tags.uses - b.tags.uses)

		if (abilities.length > 0) {
			const abilityNames = abilities.map((x, i) => `${i + 1}. ${x.attribute.name} [x ${x.tags.uses as number}]`)
			await player
				.getGame()
				.sendPeriodPin(
					channel,
					":exclamation: You currently have the following **non-passive** limited-use abilities:\n\n```fix\n" +
						abilityNames.join("\n") +
						"\n```\nYou may use an ability __in conjunction__ with the kill. To obtain information on an ability and how to use it (if applicable), use `!ability <power name>`."
				)
		} else {
			await player
				.getGame()
				.sendPeriodPin(
					channel,
					":exclamation: You have no **non-passive** limited-use abilities left.\n\nTo obtain information on a specific ability, use `!ability <power name>`."
				)
		}
	}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DEAD: false,
		ALLOW_NIGHT: true,
		ALLOW_DAY: false,
	}
}
