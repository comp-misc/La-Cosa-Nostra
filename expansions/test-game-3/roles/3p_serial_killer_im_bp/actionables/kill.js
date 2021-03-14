var mafia = require("../../../../../lcn")

var rs = mafia.rolesystem

module.exports = function (actionable, game, params) {
	var outcome = rs.prototypes.basicAttack(...arguments)
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]