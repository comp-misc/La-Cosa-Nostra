var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	// Deal basic attack to the guard
	rs.prototypes.basicAttack({ from: params.attacker, to: actionable.from }, game, params)
}