var rs = require("../../../../../rolesystem/rolesystem")

module.exports = function (actionable, game) {
	rs.prototypes.unstoppableAttack.reason = "dealt a fatal blow by a member of the __Mafia__"

	var from = game.getPlayerByIdentifier(actionable.from)
	var outcome = rs.prototypes.unstoppableAttack(...arguments)

	if (!outcome) {
		game.addMessage(from, ":exclamation: Your target could not be attacked last night!")
	}

	from.misc.strongman_kills_left--
}

module.exports.TAGS = ["visit"]
