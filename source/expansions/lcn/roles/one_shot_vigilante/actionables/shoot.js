var rs = require("../../../../../rolesystem/rolesystem")

module.exports = function (actionable, game) {
	rs.prototypes.powerfulAttack.reason = "shot by a __Vigilante__"

	var outcome = rs.prototypes.powerfulAttack(...arguments)

	var from = game.getPlayerByIdentifier(actionable.from)
	from.misc.vigilante_bullets--

	if (!outcome) {
		game.addMessage(from, ":exclamation: Your target could not be attacked last night!")
	}
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]
