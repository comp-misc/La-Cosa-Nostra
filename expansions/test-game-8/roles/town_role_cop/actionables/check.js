var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Rolecop-investigation",
	})

	var from = game.getPlayerByIdentifier(actionable.from)
	var target = game.getPlayerByIdentifier(actionable.to)

	// Enumerate
	switch (target.role_identifier) {
		case "mafia_cop_role_cop":
			var display_role = "Role and Alignment Cop"
			break

		case "town_backup":
			var display_role = "Backup"
			break

		case "town_role_cop":
			var display_role = "Role Cop"
			break

		case "town_sheriff_cop":
			var display_role = "Sheriff"
			break

		case "town_alignment_cop":
			var display_role = "Cop"
			break

		default:
			var display_role = "Unknown"
			break
	}

	var response = ":mag: Your target is a __" + display_role + "__."

	game.addMessage(from, response)
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]