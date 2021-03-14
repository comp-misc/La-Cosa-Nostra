module.exports = function (actionable, game, params) {
	var self = game.getPlayerByIdentifier(actionable.from)

	self.misc.jester_lynched = true

	self.getPrivateChannel().send(":ghost:  You successfully got yourself lynched!")

	return true
}
