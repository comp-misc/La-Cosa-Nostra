// Executes BEFORE introduction

module.exports = function (player) {
	var game = player.game

	var main = game.getMainChannel()

	player.addIntroMessage(
		":exclamation: You are the President! Make sure to stay alive to ensure the situation stays under control. If you die, mafias and town will lose all their active role actions."
	)
	game.addIntroMessage(main.id, ":exclamation: There is a President alive!")
	//SEND DETTE TIL LOGBOOK: :exclamation: There is a President alive!");

	player.misc.executions = 1
}
