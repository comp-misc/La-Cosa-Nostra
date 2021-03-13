// Executes BEFORE introduction

module.exports = function (player) {
	player.misc.executions = 1

	var game = player.game

	var main = game.getMainChannel()
	//var logbook = game.getLogbookChannel();

	//game.addIntroMessage(logbook.id, ":exclamation: **" + player.getDisplayName() + "** has been revealed to be a __Innocent Child__!");
	player.addIntroMessage(
		":exclamation: You are the President!\n\nMake sure to stay alive to ensure the situation stays under control. If you die, mafias and town will lose all their active role actions."
	)

	innocent_child = game.findAll((x) => x.role_identifier === "town_innocent_child")
	prime_minister = game.findAll((x) => x.role_identifier === "town_prime_minister")

	if (innocent_child.length > 0) {
		return true
	}

	president = game.findAll((x) => x.role_identifier === "town_president")

	for (var i = 0; i < president.length - 1; i++) {
		president[i].misc.intro_messages = true
	}

	if (player.misc.intro_messages === true) {
		return true
	}

	game.addIntroMessage(main.id, ":exclamation: There is a President alive!")

	for (var i = 0; i < prime_minister.length; i++) {
		game.addIntroMessage(main.id, ":exclamation: There is a Prime Minister alive!")
	}
}
