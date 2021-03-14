var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	var target = game.getPlayerByIdentifier(actionable.to)
	var alien = game.getPlayerByIdentifier(actionable.from)

	rs.prototypes.basicKidnap.reason = "abducted"
	var outcome = rs.prototypes.basicKidnap(...arguments)

	//if (outcome) {
	//  game.addMessage(target, ":exclamation: You were abducted last night!");
	//} else {
	//  game.addMessage(target, ":exclamation: Someone tried to abduct you last night but you could not be abducted!");
	//};

	alien.misc.consecutive_night = true
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]