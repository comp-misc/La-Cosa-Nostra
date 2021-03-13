var lcn = require("../../../../../source/lcn.js")

// Executes BEFORE introduction

var auxils = lcn.auxils

module.exports = function (player) {
	var game = player.game
	var config = game.config

	// Form as many pairs as possible before forming triplets
	var available = game.findAll(
		(x) => x.role_identifier === "town_lover" && x.isAlive() && x.identifier !== player.identifier
	)

	var display = getLoversDisplay(available)

	player.addIntroMessage(display)

	for (var i = 0; i < available.length - 2; i++) {
		if (available[i].misc.suicide === true) {
			return null
		}

		game.addAction("town_lover/suicide", ["killed"], {
			from: player,
			to: available[i],
			expiry: Infinity,
			tags: ["permanent"],
		})
	}

	available = lcn.auxils.cryptographicShuffle(available)

	if (player.misc.paired) {
		return null
	}

	if (available.length < 1) {
		throw new Error("Unpairable number of lovers!")
	}

	player.misc.lover_initiator = true

	if (available.length === 2) {
		var group = [player].concat(available.splice(0, 2))
	} else {
		var group = [player].concat(available.splice(0, 1))
	}

	for (var i = 0; i < group.length; i++) {
		group[i].misc.paired = true
	}

	createLoverChannels(group)

	// Always put lower alphabet first
	async function createLoverChannels(players) {
		var read_perms = config["base-perms"]["read"]

		players.sort((a, b) => {
			if (a.alphabet < b.alphabet) {
				return -1
			}
			if (a.alphabet > b.alphabet) {
				return 1
			}
			return 0
		})

		var name = "lovers-" + players.map((x) => x.alphabet).join("-")

		var perms = players.map((x) => {
			return { target: x.getDiscordUser(), permissions: read_perms }
		})

		var channel = await game.createPrivateChannel(name, perms)

		for (var i = 0; i < players.length; i++) {
			// Add channels
			players[i].misc.lover_channel = channel.id

			players[i].addSpecialChannel(channel)
		}

		await channel.send("**This is the Lovers' chat.**\n\nThis chat is open to involved parties only at night.")

		game.setChannel(name, channel)
	}

	function getLoversDisplay(lovers) {
		if (lovers.length == 1) {
			return ":heart:  Your lover is **" + lovers[0].getDisplayName() + "**!"
		} else {
			var display = ":heart:  Your lovers are **" + lovers[0].getDisplayName() + "**"
			for (var i = 0; i < lovers.length - 2; i++) {
				display = display + ", **" + lovers[i + 1].getDisplayName() + "**"
			}
			display = display + " and **" + lovers[lovers.length - 1].getDisplayName() + "**!"
			return display
		}
	}
}
