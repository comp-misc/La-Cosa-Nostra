var lcn = require("../../../../../source/lcn.js")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	var player = game.getPlayerByIdentifier(actionable.to)

	if (!player.isAlive()) {
		return null
	}

	var president = game.findAll((x) => x.role_identifier === "town_president")
	var prime_minister = game.findAll((x) => x.role_identifier === "town_prime_minister")

	var president_alive = game.findAll((x) => x.role_identifier === "town_president" && x.isAlive())
	var prime_minister_alive = game.findAll((x) => x.role_identifier === "town_prime_minister" && x.isAlive())

	if (president.length == 0 && prime_minister.length == 0) {
		return null
	}

	if (president_alive.length + prime_minister_alive.length > 0) {
		return null
	}

	var var_president = "President"
	var var_prime_minister = "Prime Minister"

	if (president.length > 1) {
		var_president = "Presidents"
	}

	if (prime_minister.length > 1) {
		var_prime_minister = "Prime Ministers"
	}

	if (prime_minister.length == 0) {
		game.addMessage(
			player,
			":exclamation: You were demoted to a __Mafia Goon__.\n\nAs a result of the death of the " +
				var_president +
				" you lost all your actions!"
		)
	}

	if (president.length == 0) {
		game.addMessage(
			player,
			":exclamation: You were demoted to a __Mafia Goon__.\n\nAs a result of the death of the " +
				var_prime_minister +
				" you lost all your actions!"
		)
	}

	if (president.length > 0 && prime_minister.length > 0) {
		game.addMessage(
			player,
			":exclamation: You were demoted to a __Mafia Goon__.\n\nAs a result of the death of the " +
				var_president +
				" and " +
				var_prime_minister +
				" you lost all your actions!"
		)
	}

	player.changeRole("mafia_goon")

	return true
}
