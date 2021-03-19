var lcn = require("../../../../../source/lcn")

var rs = lcn.rolesystem
var auxils = lcn.auxils

module.exports = function (actionable, game, params) {
	var visit_log = game.actions.visit_log
	var visitor_names = new Array()

	for (var i = 0; i < visit_log.length; i++) {
		if (visit_log[i].target === actionable.to) {
			// Target
			var visitor = game.getPlayerByIdentifier(visit_log[i].visitor)
			visitor_names.push("**" + visitor.getDisplayName() + "**")
		}
	}

	var lookout = game.getPlayerByIdentifier(actionable.from)

	visitor_names.sort()

	if (visitor_names.length > 0) {
		var message = ":telescope:  Your target was visited by someone."

		game.addMessage(lookout, message)
	} else {
		game.addMessage(lookout, ":telescope:  Your target was not visited by anyone.")
	}
}
