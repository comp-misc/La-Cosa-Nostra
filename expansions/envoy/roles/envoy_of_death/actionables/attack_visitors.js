var lcn = require("../../../../../source/lcn")

var rs = lcn.rolesystem

// Defaults to shooting
// Godfather can override

// See godfather/kill_vote

module.exports = function (actionable, game, params) {
	if (params.visitor !== actionable.from) {
		rs.prototypes.unstoppableAttack.reason = "murdered"

		// Astral
		var outcome = rs.prototypes.unstoppableAttack(
			{
				from: actionable.from,
				to: params.visitor,
				priority: actionable.priority,
			},
			game,
			params,
			true
		)
	}
}
