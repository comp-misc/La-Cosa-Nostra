module.exports = function (actionable, game) {
	var target = game.getPlayerByIdentifier(actionable.from)
	target.clearDisplayRole()
}
