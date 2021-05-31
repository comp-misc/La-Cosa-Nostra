import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import Player from "../../../../systems/game_templates/Player"
import { ProgrammableRole, RoleProperties, RoutineProperties } from "../../../../systems/Role"
import killCmd from "./commands/kill"
import roleblockCmd from "./commands/roleblock"
import trackCmd from "./commands/track"
import roleProperties from "./role.json"
import Ability from "./Ability"
import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"

const DESCRIPTION = `
Welcome to \${game.name} You are the Jack of All Trades.

Role Abilities:
- 1x Vigilante Night Kill - perform a vigilante night kill
- 1x Roleblock - roleblock a player and prevent them from performing night actions
- 1x Track - track a player to discover who they visited during the night, if anyone

Win Condition: You win when all threats to town have been eliminated and there is at least one member of town left.
`

export default class JackOfAllTrades implements ProgrammableRole<null> {
	readonly config = null
	readonly properties: RoleProperties = roleProperties
	readonly commands: CommandProperties<RoleCommand>[] = [killCmd, trackCmd, roleblockCmd]

	getDescription(): string {
		return DESCRIPTION
	}

	async onStart(player: Player): Promise<void> {
		await player.getGame().addAction("jack_of_all_trades/roleblock_noresult", ["roleblock"], {
			from: player,
			to: player,
			expiry: Infinity,
			tags: ["permanent"],
			priority: ActionPriorities.HIGH,
		})
		player.misc.usedAbilities = []
	}

	async onRoutines(player: Player): Promise<void> {
		if (player.misc.currentAction) {
			const abilities = player.misc.usedAbilities as Ability[]
			abilities.push(player.misc.currentAction as Ability)
			player.misc.currentAction = null
		}
		if (player.getGame().isDay()) {
			return
		}

		const channel = player.getPrivateChannel()
		const abilitiesLeft = JackOfAllTrades.getAbilitiesLeft(player)
		if (abilitiesLeft.length > 0) {
			const actionList = abilitiesLeft.map((action) => ` - 1x ${action}`).join("\n")
			await player
				.getGame()
				.sendPeriodPin(
					channel,
					"You have the following actions available:\n" +
						actionList +
						"\nUse `!<action> <player | nobody>` to use an action. You may only use 1 action each night."
				)
		} else {
			await player.getGame().sendPeriodPin(channel, "You have no remaining actions.")
		}
	}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DAY: false,
		ALLOW_DEAD: false,
		ALLOW_NIGHT: true,
	}

	static hasUsedAbility(player: Player, ability: Ability): boolean {
		return (player.misc.usedAbilities as Ability[]).includes(ability)
	}

	static addUsedAbility(player: Player, ability: Ability): void {
		const abilities = player.misc.usedAbilities as Ability[]
		abilities.push(ability)
	}

	static getAbilitiesLeft(player: Player): Ability[] {
		return Object.values(Ability).filter((ability) => !(player.misc.usedAbilities as Ability[]).includes(ability))
	}
}
