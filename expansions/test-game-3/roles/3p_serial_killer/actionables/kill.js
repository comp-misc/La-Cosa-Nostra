var mafia = require("../../../../../source/lcn")

var rs = mafia.rolesystem

module.exports = function (actionable, game, params) {
	var outcome = rs.prototypes.powerfulAttack(...arguments)
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]
