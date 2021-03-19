module.exports = function (actionable, game) {
	var target = game.getPlayerByIdentifier(actionable.to)

	target.setGameStat("vote-magnitude", 0, "set")

	return true
}
