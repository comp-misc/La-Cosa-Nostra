import { RoleActionable } from "../../../../../systems/actionables"

const responses: Record<string, string> = {
	neutral: ":mag: Your target is a __Neutral__. Their role is **{;role}**.",
	cult: ":mag: Your target belongs to the __Cult__. Their role is **{;role}**.",
	mafia: ":mag: Your target is a member of the __Mafia__. Their role is **{;role}**.",
	town: ":mag: Your target appears to be part of the __Town__. Their role is **{;role}**.",

	role: ":mag: Your target's role is **{;role}**.",
}

const investigation: RoleActionable = (actionable, game) => {
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Consigliere-investigation",
	})

	const from = game.getPlayerByIdentifierOrThrow(actionable.from)
	const target = game.getPlayerByIdentifierOrThrow(actionable.to)

	// Goes through immunity
	if (target.expandedRole()["reveal-role-on-interrogation"] === true) {
		const response = responses["role"].replace(new RegExp("{;role}", "g"), target.getDisplayRole(true))
		game.addMessage(from, response)
	} else {
		let response = responses[target.expandedRole().alignment] || responses["town"]

		response = (response ? response : responses["town"]).replace(
			new RegExp("{;role}", "g"),
			target.getDisplayRole(false)
		)

		game.addMessage(from, response)
	}
}

investigation.TAGS = ["drivable", "roleblockable", "visit"]

export = investigation
