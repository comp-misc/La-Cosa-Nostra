var lcn = require("../../../source/lcn")

var configurations = {
	C: {
		1: ["one_shot_cop"],
		2: ["cop"],
		3: ["cop", "one_shot_cop"],
		4: ["cop", "cop"],
		5: ["cop", "cop", "one_shot_cop"],
		6: ["cop", "cop", "cop"],
	},

	D: {
		1: ["doctor"],
		2: ["doctor", "one_shot_doctor"],
		3: ["doctor", "doctor"],
		4: ["doctor", "doctor", "one_shot_doctor"],
		5: ["doctor", "doctor", "doctor"],
	},

	V: {
		1: ["one_shot_vigilante"],
		2: ["vigilante"],
		3: ["vigilante", "one_shot_vigilante"],
		4: ["vigilante", "vigilante"],
		5: ["vigilante", "vigilante", "one_shot_vigilante"],
	},

	M: {
		1: ["innocent_child"],
		2: ["mason", "mason"],
		3: ["mason", "mason", "innocent_child"],
		4: ["mason", "mason", "mason"],
		5: ["mason", "mason", "mason", "mason"],
	},

	B: {
		1: ["roleblocker"],
		2: ["roleblocker", "one_shot_roleblocker"],
		3: ["roleblocker", "roleblocker"],
		4: ["roleblocker", "roleblocker", "one_shot_roleblocker"],
	},

	T: {
		0: ["mafia_goon", "mafia_roleblocker", "mafia_godfather"],
		1: ["mafia_goon", "mafia_roleblocker", "mafia_godfather", "serial_killer"],
		2: ["mafia_goon", "mafia_roleblocker", "mafia_godfather"],
		3: ["mafia_goon", "mafia_goon", "mafia_roleblocker", "serial_killer"],
		4: ["mafia_goon", "mafia_goon", "mafia_roleblocker"],
		5: ["mafia_goon", "mafia_roleblocker", "serial_killer"],
		6: ["mafia_goon", "mafia_godfather"],
		7: ["mafia_goon", "mafia_godfather", "serial_killer"],
	},
}

module.exports = function (playing_config) {
	var logger = process.logger
	if (playing_config.roles) {
		logger.log(2, "[C9++] Not running setup randomiser as roles have been defined.")

		var override = { flavour: "c9++" }
		return lcn.auxils.objectOverride(playing_config, override)
	}

	var numbers = new Array()
	var letters = new Array()

	for (var i = 0; i < 7; i++) {
		var number = Math.ceil(lcn.auxils.cryptoRandom(100, 50) * 100)
		numbers.push(number)

		switch (true) {
			case number <= 50:
				letters.push("T")
				break

			case number > 50 && number <= 65:
				letters.push("C")
				break

			case number > 65 && number <= 75:
				letters.push("D")
				break

			case number > 75 && number <= 85:
				letters.push("V")
				break

			case number > 85 && number <= 95:
				letters.push("M")
				break

			case number > 95:
				letters.push("B")
				break
		}
	}

	letters.sort()

	// Enumerate setup

	/*
  var roles = {

    mafia_goon: {identifier: "mafia_goon", attributes: [{identifier: "mafia_factionkill"}]},
    mafia_roleblocker: {identifier: "mafia_roleblocker", attributes: [{identifier: "mafia_factionkill"}]},
    mafia_godfather: {identifier: "mafia_godfather"}

  };
  */

	var setup = new Array()

	for (var key in configurations) {
		// Assign
		var number = letters.filter((x) => x === key).length

		var addition = configurations[key][number.toString()] ? configurations[key][number.toString()] : new Array()

		setup = setup.concat(addition)
	}

	var townies = new Array(13 - setup.length).fill("vanilla_townie")
	setup = setup.concat(townies)

	logger.log(2, "[C9++] Running setup: %s; rolled: %s", letters.join(""), numbers.join(", "))

	var override = { roles: setup, flavour: "c9++" }

	return lcn.auxils.objectOverride(playing_config, override)
}
