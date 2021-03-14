module.exports = function (player) {
	var game = player.game

	var main = game.getMainChannel()

	player.setStatus("lynchProof", true)

	player.misc.praetor_conversions = new Array()

	game.addIntroMessage(main.id, ":exclamation: **" + player.getDisplayName() + "** is the Praetor.")
}
