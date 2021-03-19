import { Snowflake } from "discord.js"
import { RoleActionable } from "../../../../../systems/actionables"

const poison: RoleActionable = (actionable, game) => {
	const poisoned = game.getPlayerByIdentifierOrThrow(actionable.to)
	const poisoner = game.getPlayerByIdentifierOrThrow(actionable.from)

	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Apothecarist-poison",
	})

	game.addAction("apothecarist/poison_kill", ["cycle"], {
		name: "Poison-kill",
		expiry: 3,
		execution: 3,
		from: actionable.from,
		to: actionable.to,
		attack: actionable.target as Snowflake,
		priority: 4,
		tags: ["poison"],
	})

	game.addMessage(
		poisoned,
		":exclamation: You were poisoned last night! You will die from the poison if you are not cured before tomorrow."
	)

	poisoner.misc.apothecarist_poisons_left--
}

poison.TAGS = ["drivable", "roleblockable", "visit"]

export = poison
