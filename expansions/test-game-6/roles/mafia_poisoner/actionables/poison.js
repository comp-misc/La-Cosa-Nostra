var lcn = require("../../../../../source/lcn")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	if (CheckDoctorOnTarget(game)) {
		return null
	}

	var poisoned = game.getPlayerByIdentifier(actionable.to)
	var poisoner = game.getPlayerByIdentifier(actionable.from)

	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Toxicologist-poison",
	})

	game.addAction("mafia_poisoner/poison_kill", ["cycle"], {
		name: "Poison-kill",
		expiry: 3,
		execution: 3,
		from: actionable.from,
		to: actionable.to,
		attack: actionable.target,
		priority: 4,
		tags: ["poison"],
	})

	game.addMessage(
		poisoned,
		":exclamation: You were poisoned last night! You will die from the poison if you are not cured before tomorrow."
	)

	poisoner.misc.toxicologist_poisons_left--

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

module.exports.TAGS = ["drivable", "roleblockable", "visit"]
