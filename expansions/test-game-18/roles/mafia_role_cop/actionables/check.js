var lcn = require("../../../../../source/lcn.js")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Rolecop-investigation",
	})

	var from = game.getPlayerByIdentifier(actionable.from)
	var target = game.getPlayerByIdentifier(actionable.to)

	var display_role = ""
	var extra_role_length = 0

	switch (target.role_identifier[0]) {
		case "t":
			switch (target.role_identifier.slice(5, 11)) {
				case "1_shot":
					display_role = "1-shot "
					var extra_role_length = 7
					break

				case "2_shot":
					display_role = "2-shot "
					var extra_role_length = 7
					break

				case "even_n":
					display_role = "Even-Night "
					var extra_role_length = 11
					break

				case "odd_ni":
					display_role = "Odd-Night "
					var extra_role_length = 10
					break

				case "even_d":
					display_role = "Even-Day "
					var extra_role_length = 9
					break

				case "odd_da":
					display_role = "Odd-Day "
					var extra_role_length = 8
					break

				case "noncon":
					display_role = "Nonconsecutive "
					var extra_role_length = 15
			}

			switch (target.role_identifier.length - extra_role_length) {
				case 9:
					display_role += "Bomb"
					break

				case 10:
					switch (target.role_identifier[target.role_identifier.length - 2]) {
						case "i":
							display_role += "Cupid"
							break

						case "e":
							display_role += "Lover"
							break

						case "o":
							display_role += "Mayor"
					}
					break

				case 11:
					switch (target.role_identifier[target.role_identifier.length - 2]) {
						case "o":
							display_role += "Doctor"
							break

						case "l":
							display_role += "Oracle"
							break

						case "e":
							display_role += "Miller"
					}
					break

				case 12:
					switch (target.role_identifier[target.role_identifier.length - 3]) {
						case "r":
							display_role += "Veteran"
							break

						case "k":
							display_role += "Tracker"
							break

						case "h":
							display_role += "Watcher"
							break

						case "t":
							display_role += "Ascetic"
					}
					break

				case 13:
					switch (target.role_identifier[target.role_identifier.length - 8]) {
						case "o":
							display_role += "Observer"
							break

						case "p":
							display_role += "Poisoner"
							break

						case "r":
							display_role += "Role Cop"
							break

						case "g":
							display_role += "Governor"
							break

						case "c":
							display_role += "Commuter"
					}
					break

				case 14:
					switch (target.role_identifier[target.role_identifier.length - 3]) {
						case "a":
							display_role += "Bodyguard"
							break

						case "p":
							display_role += "Kidnapper"
							break

						case "g":
							display_role += "Messenger"
							break

						case "n":
							display_role += "Vigilante"
							break

						case "o":
							display_role += "Neighbour"
							break

						case "e":
							display_role += "President"
					}
					break

				case 15:
					switch (target.role_identifier[target.role_identifier.length - 4]) {
						case "o":
							display_role += "Dayshooter"
							break

						case "e":
							display_role += "Jailkeeper"
							break

						case "i":
							display_role += "Neapolitan"
					}
					break

				case 16:
					switch (target.role_identifier[target.role_identifier.length - 3]) {
						case "k":
							display_role += "Roleblocker"
							break

						case "t":
							display_role += "Firefighter"
							break

						case "o":
							display_role += "Bulletproof"
					}
					break

				case 17:
					switch (target.role_identifier[target.role_identifier.length - 3]) {
						case "t":
							display_role += "Interrogator"
							break

						case "k":
							display_role += "Lazy Tracker"
							break

						case "h":
							display_role += "Lazy Watcher"
					}
					break

				case 18:
					display_role += "Alignment Cop"
					break

				case 19:
					switch (target.role_identifier[target.role_identifier.length - 1]) {
						case "d":
							display_role += "Innocent Child"
							break

						case "r":
							display_role += "Prime Minister"
							break

						case "e":
							display_role += "Vanilla Townie"
					}
					break

				case 20:
					display_role += "Vote Influencer"
					break

				case 23:
					display_role += "Compulsive Visitor"
			}
	}

	switch (target.role_identifier[0]) {
		case "m":
			switch (target.role_identifier.slice(6, 12)) {
				case "1_shot":
					display_role = "1-shot "
					var extra_role_length = 7
					break

				case "2_shot":
					display_role = "2-shot "
					var extra_role_length = 7
					break

				case "even_n":
					display_role = "Even-Night "
					var extra_role_length = 11
					break

				case "odd_ni":
					display_role = "Odd-Night "
					var extra_role_length = 10
					break

				case "noncon":
					display_role = "Nonconsecutive "
					var extra_role_length = 15
			}

			switch (target.role_identifier.length - extra_role_length) {
				case 10:
					display_role += "Mafia Goon"
					break

				case 12:
					switch (target.role_identifier[target.role_identifier.length - 2]) {
						case "o":
							display_role += "Doctor"
							break

						case "e":
							display_role += "Lawyer"
					}
					break

				case 13:
					switch (target.role_identifier.slice(target.role_identifier.length - 5, target.role_identifier.length - 3)) {
						case "ni":
							display_role += "Janitor"
							break

						case "ac":
							display_role += "Tracker"
							break

						case "tc":
							display_role += "Watcher"
							break

						case "ce":
							display_role += "Ascetic"
							break

						case "ai":
							display_role += "Traitor"
					}
					break

				case 14:
					switch (target.role_identifier[target.role_identifier.length - 1]) {
						case "r":
							display_role += "Poisoner"
							break

						case "p":
							display_role += "Role Cop"
					}
					break

				case 15:
					switch (target.role_identifier[target.role_identifier.length - 9]) {
						case "d":
							display_role += "Deflector"
							break

						case "k":
							display_role += "Kidnapper"
							break

						case "m":
							display_role += "Messenger"
							break

						case "s":
							display_role += "Strongman"
							break

						case "g":
							display_role += "Godfather"
							break

						case "n":
							display_role += "Neighbour"
					}
					break

				case 16:
					switch (target.role_identifier[target.role_identifier.length - 1]) {
						case "r":
							display_role += "Jailkeeper"
							break

						case "n":
							display_role += "Neapolitan"
							break

						case "c":
							display_role += "Pyromaniac"
					}
					break

				case 17:
					switch (target.role_identifier[target.role_identifier.length - 1]) {
						case "r":
							display_role += "Roleblocker"
							break

						case "f":
							display_role += "Bulletproof"
					}
					break

				case 21:
					display_role += "Vote Influencer"
			}
	}

	switch (target.role_identifier[0]) {
		case "3":
			switch (target.role_identifier) {
				case "3p_serial_killer_im_bp":
					display_role = "Serial Killer"
					break

				case "3p_arsonist_im_bp":
					display_role = "Arsonist"
					break

				case "3p_fool":
					display_role = "Fool"
					break

				case "3p_jester":
					display_role = "Jester"
					break

				case "3p_survivor":
					display_role = "Survivor"
			}
	}

	switch (display_role) {
		case "":
			display_role = "not known rolefor some reason. This is an error @Unusual"
			break

		case "1-shot ":
			display_role = "not known role for some reason. This is an error @Unusual"
			break

		case "2-shot ":
			display_role = "not known role for some reason. This is an error @Unusual"
			break

		case "Even-Night ":
			display_role = "not known role for some reason. This is an error @Unusual"
			break

		case "Odd-Night ":
			display_role = "not known role for some reason. This is an error @Unusual"
			break

		case "Even-Day ":
			display_role = "not known role for some reason. This is an error @Unusual"
			break

		case "Odd-Day ":
			display_role = "not known role for some reason. This is an error @Unusual"
			break

		case "Nonconsecutive ":
			display_role = "not known role for some reason. This is an error @Unusual"
			break
	}

	var response = ":mag_right:  Your target is a __" + display_role + "__."

	game.addMessage(from, response)
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]
