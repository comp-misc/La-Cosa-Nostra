module.exports = function (player) {
	var game = player.game

	var main = game.getMainChannel()
	//var logbook = game.getLogbookChannel();

	//game.addIntroMessage(logbook.id, ":exclamation: **" + player.getDisplayName() + "** has been revealed to be a __Innocent Child__!");
	player.addIntroMessage(
		":exclamation: You are the Prime Minister!\n\nMake sure to stay alive to ensure the situation stays under control. If you die, mafias and town will lose all their active role actions."
	)

	innocent_child = game.findAll((x) => x.role_identifier === "town_innocent_child")
	president = game.findAll((x) => x.role_identifier === "town_president")

	if (innocent_child.length > 0 || president.length > 0) {
		return true
	}

	game.addIntroMessage(main.id, ":exclamation: There is a Prime Minister alive!")
}
