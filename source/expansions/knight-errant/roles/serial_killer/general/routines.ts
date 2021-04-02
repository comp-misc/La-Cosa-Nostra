import { RoleRoutine } from "../../../../../systems/Role"

// Function should be synchronous
const routines: RoleRoutine = async (player) => {
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
			x.attribute["modular-details"]["cluster"] === "ability"
	)

	abilities.sort((a, b) => a.tags.uses - b.tags.uses)

	if (abilities.length > 0) {
		const abilityNames = abilities.map((x, i) => i + 1 + ". " + x.attribute.name + " [x " + x.tags.uses + "]")
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

routines.ALLOW_DEAD = false
routines.ALLOW_NIGHT = true
routines.ALLOW_DAY = false

export default routines
