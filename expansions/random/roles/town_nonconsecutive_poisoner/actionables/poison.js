var lcn = require("../../../../../source/lcn.js")

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

	game.addAction("town_nonconsecutive_poisoner/poison_kill", ["cycle"], {
		name: "Poison-kill",
		expiry: 3,
		execution: 3,
		from: actionable.from,
		to: actionable.to,
		attack: actionable.target,
		priority: 4,
		tags: ["poison"],
	})

	poisoner.misc.consecutive_night = false

	game.addMessage(
		poisoned,
		":exclamation: You were poisoned last night! You will die from the poison if you are not cured before tomorrow."
	)

	function CheckDoctorOnTarget(game) {
		var doctor = game.findAll((x) => x.role_identifier === "town_doctor" && x.isAlive())
		doctor += game.findAll((x) => x.role_identifier === "town_1_shot_doctor" && x.isAlive())
		doctor += game.findAll((x) => x.role_identifier === "town_2_shot_doctor" && x.isAlive())
		doctor += game.findAll((x) => x.role_identifier === "town_odd_night_doctor" && x.isAlive())
		doctor += game.findAll((x) => x.role_identifier === "town_even_night_doctor" && x.isAlive())
		doctor += game.findAll((x) => x.role_identifier === "town_nonconsecutive_doctor" && x.isAlive())
		doctor += game.findAll((x) => x.role_identifier === "mafia_doctor" && x.isAlive())
		doctor += game.findAll((x) => x.role_identifier === "mafia_1_shot_doctor" && x.isAlive())
		doctor += game.findAll((x) => x.role_identifier === "mafia_2_shot_doctor" && x.isAlive())
		doctor += game.findAll((x) => x.role_identifier === "mafia_odd_night_doctor" && x.isAlive())
		doctor += game.findAll((x) => x.role_identifier === "mafia_even_night_doctor" && x.isAlive())
		doctor += game.findAll((x) => x.role_identifier === "mafia_nonconsecutive_doctor" && x.isAlive())

		if (doctor.length > 0) {
			var visit_log = game.actions.visit_log
			for (var i = 0; i < visit_log.length; i++) {
				if (visit_log[i].target === actionable.to) {
					var visitor = game.getPlayerByIdentifier(game.actions.visit_log[i].visitor)
					if (
						visitor.role_identifier === "town_doctor" ||
						visitor.role_identifier === "town_1_shot_doctor" ||
						visitor.role_identifier === "town_2_shot_doctor" ||
						visitor.role_identifier === "town_odd_night_doctor" ||
						visitor.role_identifier === "town_even_night_doctor" ||
						visitor.role_identifier === "town_nonconsecutive_doctor" ||
						visitor.role_identifier === "mafia_doctor" ||
						visitor.role_identifier === "mafia_1_shot_doctor" ||
						visitor.role_identifier === "mafia_2_shot_doctor" ||
						visitor.role_identifier === "mafia_odd_night_doctor" ||
						visitor.role_identifier === "mafia_even_night_doctor" ||
						visitor.role_identifier === "mafia_nonconsecutive_doctor"
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
