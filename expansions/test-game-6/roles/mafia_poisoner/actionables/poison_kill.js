var lcn = require("../../../../../source/lcn.js")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	// Deals an Unstoppable attack

	var poisoner = game.getPlayerByIdentifier(actionable.from)
	var poisoned = game.getPlayerByIdentifier(actionable.to)

	if (!poisoned.isAlive()) {
		return null
	}

	if (CheckDoctorOnTarget(game)) {
		return null
	}

	rs.prototypes.unstoppableAttack.reason = "poisoned to death by a member of the __Mafia__"

	var outcome = rs.prototypes.unstoppableAttack(...arguments)

	function CheckDoctorOnTarget(game) {
		var doctor = game.findAll((x) => x.role_identifier === "town_doctor_single_prot" && x.isAlive())
		doctor += game.findAll((x) => x.role_identifier === "mafia_doctor_full_prot" && x.isAlive())

		if (doctor.length > 0) {
			var visit_log = game.actions.visit_log
			for (var i = 0; i < visit_log.length; i++) {
				if (visit_log[i].target === actionable.to) {
					var visitor = game.getPlayerByIdentifier(game.actions.visit_log[i].visitor)
					if (
						visitor.role_identifier === "town_doctor_single_prot" ||
						visitor.role_identifier === "mafia_doctor_full_prot"
					) {
						return true
					}
				}
				if (i === visit_log.length - 1) {
					return false
				}
			}
		} else {
			return false
		}
	}
}
