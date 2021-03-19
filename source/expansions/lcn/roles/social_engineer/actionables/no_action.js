module.exports = function (actionable, game) {
	var social_engineer = game.getPlayerByIdentifier(actionable.from)

	social_engineer.misc.se_influence_log.unshift(null)

	return true
}
