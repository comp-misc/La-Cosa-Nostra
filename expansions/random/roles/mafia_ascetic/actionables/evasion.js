var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem
var auxils = lcn.auxils

module.exports = function (actionable, game, params) {
	var exclusion = [
		"a/mafia_factionkill",
		"3p_serial_killer/kill",
		"3p_serial_killer_im_bp/kill",
		"town_dayshooter/shoot",
		"town_1_shot_dayshooter/shoot",
		"town_2_shot_dayshooter/shoot",
		"town_even_day_dayshooter/shoot",
		"town_odd_day_dayshooter/shoot",
		"town_nonconsecutive_dayshooter/shoot",
		"town_vigilante/kill",
		"town_1_shot_vigilante/kill",
		"town_2_shot_vigilante/kill",
		"town_even_night_vigilante/kill",
		"town_nonconsecutive_vigilante/kill",
		"town_odd_night_vigilante/kill",
		"town_governor/execute",
		"town_president/execute",
	]

	var actions = game.actions.findAll(
		(x) => x.to === actionable.from && !x.tags.includes("permanent") && !exclusion.includes(x.identifier)
	)

	var players = new Array()

	for (var i = 0; i < actions.length; i++) {
		// Set roleblocked
		players.push(actions[i].from)
	}

	var unique = auxils.getUniqueArray(players)

	for (var i = 0; i < unique.length; i++) {
		game.execute("roleblock", {
			roleblocker: actionable.from,
			target: unique[i],
			priority: actionable.priority,
			reason: "Unknown-god-roleblock",
		})

		game.getPlayerByIdentifier(unique[i]).setStatus("roleblocked", true)
	}

	game.actions.delete(
		(x) => x.to === actionable.from && !x.tags.includes("permanent") && !exclusion.includes(x.identifier)
	)
}