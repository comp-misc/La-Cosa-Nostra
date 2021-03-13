var lcn = require("../../../../../source/lcn")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	var main = game.getMainChannel()

	var attacker = game.getPlayerByIdentifier(params.attacker)
	var attacked = game.getPlayerByIdentifier(actionable.from)

	var visit_log = game.actions.visit_log

	for (var i = 0; i < visit_log.length; i++) {
		if (visit_log[i].target === attacked) {
			rs.prototypes.basicAttack({ from: attacked.id, to: attacker.id }, game, params)
		}
	}
}
