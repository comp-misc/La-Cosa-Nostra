var lcn = require("../../../../../source/lcn.js")

var rs = lcn.rolesystem

var responses = {
	neutral: ":mag: Your target is __guilty__.",
	cult: ":mag: Your target is __guilty__.",
	mafia: ":mag: Your target is __guilty__.",
	town: ":mag: Your target is __not guilty__.",

	role: ":mag: Your target's role is **{;role}**.",
}

module.exports = function (actionable, game, params) {
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Cop-investigation",
	})

	var from = game.getPlayerByIdentifier(actionable.from)
	var target = game.getPlayerByIdentifier(actionable.to)

	// Check roles
	var immunity = target.getStat("detection-immunity", Math.max)

	// Not immune
	if (immunity < 1) {
		if (target.role["reveal-role-on-interrogation"] === true) {
			var response = responses["role"].replace(new RegExp("{;role}", "g"), target.role["role-name"])
			game.addMessage(from, CheckMafiaLawyerOnTarget(response, game))
		} else if (target.role_identifier === "town_miller") {
			var response = responses["mafia"]
			game.addMessage(from, CheckMafiaLawyerOnTarget(response, game))
		} else {
			var response = responses[target.role.alignment]
			game.addMessage(
				from,
				CheckMafiaLawyerOnTarget(response, game)
					? CheckMafiaLawyerOnTarget(response, game)
					: CheckMafiaLawyerOnTarget(responses["town"], game)
			)
		}
	} else {
		// Show Town
		game.addMessage(from, CheckMafiaLawyerOnTarget(responses["town"], game))
	}

	function CheckMafiaLawyerOnTarget(normal_response, game) {
		var mafia_lawyer = game.findAll((x) => x.role_identifier === "mafia_lawyer" && x.isAlive())
		if (mafia_lawyer.length > 0) {
			var visit_log = game.actions.visit_log
			for (var i = 0; i < visit_log.length; i++) {
				if (visit_log[i].target === actionable.to) {
					var visitor = game.getPlayerByIdentifier(game.actions.visit_log[i].visitor)
					if (visitor.role_identifier === "mafia_lawyer") {
						if (normal_response === responses["town"]) {
							return responses["mafia"]
						}
						if (normal_response === responses["mafia"]) {
							return responses["town"]
						}
					}
				}
				if (i === visit_log.length - 1) {
					return normal_response
				}
			}
		} else {
			return normal_response
		}
	}
}
// ----

module.exports.TAGS = ["drivable", "roleblockable", "visit"]
