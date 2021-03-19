var rs = require("../../../../../rolesystem/rolesystem")

module.exports = function (actionable, game) {
	rs.prototypes.basicAttack.reason = "destroyed by __Pestilence__"

	game.addAction("pestilence/attack_visitors", ["retrovisit"], {
		from: actionable.from,
		to: actionable.to,
		expiry: 1,
	})
}

module.exports.TAGS = ["roleblockable", "visit"]
