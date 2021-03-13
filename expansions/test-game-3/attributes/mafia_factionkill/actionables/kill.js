var mafia = require("../../../../../source/lcn")

var rs = mafia.rolesystem

// Defaults to shooting
// Godfather can override

// See godfather/kill_vote

module.exports = function (actionable, game, params) {
	rs.prototypes.basicAttack(...arguments)
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]
