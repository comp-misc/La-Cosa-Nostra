var mafia = require("../../../../../source/lcn")

// Executes BEFORE introduction

var auxils = mafia.auxils

module.exports = function (player) {
	// Find pair
	// If multiple available, shuffle

	var game = player.game
	var config = game.config

	player.game.addAction("mafia_ascetic/evasion", ["cycle"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
		priority: 0.00000000001,
	})

	player.addAttribute("mafia_factionkill")
}
