module.exports = function (actionable, game) {
	var influencer = game.getPlayerByIdentifier(actionable.from)

	influencer.misc.influencer_log.unshift(null)

	return true
}
