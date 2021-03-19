var lcn = require("../../../source/lcn")

var configurations = {
	C: {
		1: ["one_shot_cop"],
		2: ["cop"],
		3: ["cop", "one_shot_cop"],
		4: ["cop", "cop"],
		5: ["cop", "cop", "one_shot_cop"],
		6: ["cop", "cop", "cop"],
		7: ["cop", "cop", "cop", "one_shot_cop"],
		8: ["cop", "cop", "cop", "cop"],
		9: ["cop", "cop", "cop", "cop", "one_shot_cop"],
		10: ["cop", "cop", "cop", "cop", "cop"],
		11: ["cop", "cop", "cop", "cop", "cop", "one_shot_cop"],
	},

	D: {
		1: ["doctor"],
		2: ["doctor", "one_shot_doctor"],
		3: ["doctor", "doctor"],
		4: ["doctor", "doctor", "one_shot_doctor"],
		5: ["doctor", "doctor", "doctor"],
		6: ["doctor", "doctor", "doctor", "one_shot_doctor"],
		7: ["doctor", "doctor", "doctor", "doctor"],
		8: ["doctor", "doctor", "doctor", "doctor", "one_shot_doctor"],
		9: ["doctor", "doctor", "doctor", "doctor", "doctor"],
	},

	V: {
		1: ["one_shot_vigilante"],
		2: ["vigilante"],
		3: ["vigilante", "one_shot_vigilante"],
		4: ["vigilante", "vigilante"],
		5: ["vigilante", "vigilante", "one_shot_vigilante"],
		6: ["vigilante", "vigilante", "vigilante"],
		7: ["vigilante", "vigilante", "vigilante", "one_shot_vigilante"],
		8: ["vigilante", "vigilante", "vigilante", "vigilante"],
		9: ["vigilante", "vigilante", "vigilante", "vigilante", "one_shot_vigilante"],
		10: ["vigilante", "vigilante", "vigilante", "vigilante", "vigilante", "vigilante"],
	},

	M: {
		1: ["innocent_child"],
		2: ["mason", "mason"],
		3: ["mason", "mason", "innocent_child"],
		4: ["mason", "mason", "mason"],
		5: ["mason", "mason", "mason", "mason"],
		6: ["mason", "mason", "mason", "mason", "mason"],
		7: ["mason", "mason", "mason", "mason", "mason", "mason"],
		8: ["mason", "mason", "mason", "mason", "mason", "mason", "mason"],
		9: ["mason", "mason", "mason", "mason", "mason", "mason", "mason", "mason"],
		10: ["mason", "mason", "mason", "mason", "mason", "mason", "mason", "mason", "mason"],
	},

	W: {
		1: ["one_shot_tracker"],
		2: ["one_shot_tracker", "one_shot_watcher"],
		3: ["tracker", "one_shot_watcher"],
		4: ["one_shot_tracker", "watcher"],
		5: ["tracker", "watcher"],
		6: ["one_shot_tracker", "tracker", "watcher"],
		7: ["one_shot_tracker", "one_shot_watcher", "tracker", "watcher"],
		8: ["one_shot_watcher", "tracker", "tracker", "watcher"],
		9: ["tracker", "tracker", "watcher", "watcher"],
	},

	B: {
		1: ["roleblocker"],
		2: ["roleblocker", "one_shot_roleblocker"],
		3: ["roleblocker", "roleblocker"],
		4: ["roleblocker", "roleblocker", "one_shot_roleblocker"],
		5: ["roleblocker", "roleblocker", "roleblocker"],
		6: ["roleblocker", "roleblocker", "roleblocker", "one_shot_roleblocker"],
		7: ["roleblocker", "roleblocker", "roleblocker", "roleblocker"],
		8: ["roleblocker", "roleblocker", "roleblocker", "roleblocker", "one_shot_roleblocker"],
		9: ["roleblocker", "roleblocker", "roleblocker", "roleblocker", "roleblocker"],
	},

	T: {
		0: ["mafia_goon", "mafia_goon", "mafia_rolecop", "mafia_godfather", "mafia_two_shot_janitor", "mafia_roleblocker"],
		1: [
			"mafia_goon",
			"mafia_rolecop",
			"mafia_godfather",
			"mafia_two_shot_janitor",
			"mafia_roleblocker",
			"serial_killer",
			"arsonist",
		],
		2: ["mafia_goon", "mafia_goon", "mafia_godfather", "mafia_rolecop", "mafia_roleblocker", "arsonist"],
		3: ["mafia_goon", "mafia_goon", "mafia_godfather", "mafia_rolecop", "mafia_roleblocker", "serial_killer"],
		4: ["mafia_goon", "mafia_goon", "mafia_goon", "mafia_two_shot_janitor", "mafia_roleblocker", "arsonist"],
		5: ["mafia_goon", "mafia_goon", "mafia_goon", "mafia_two_shot_janitor", "mafia_roleblocker", "serial_killer"],
		6: ["mafia_goon", "mafia_goon", "mafia_goon", "mafia_two_shot_janitor", "mafia_rolecop", "arsonist"],
		7: ["mafia_goon", "mafia_goon", "mafia_goon", "mafia_two_shot_janitor", "mafia_rolecop", "serial_killer"],
		8: ["mafia_goon", "mafia_goon", "mafia_goon", "mafia_two_shot_janitor", "mafia_godfather", "arsonist"],
		9: ["mafia_goon", "mafia_goon", "mafia_goon", "mafia_two_shot_janitor", "mafia_godfather", "serial_killer"],
		10: ["mafia_goon", "mafia_goon", "mafia_goon", "mafia_goon", "mafia_godfather", "arsonist"],
		11: ["mafia_goon", "mafia_goon", "mafia_goon", "mafia_goon", "mafia_godfather", "serial_killer"],
		12: ["mafia_goon", "mafia_goon", "mafia_goon", "mafia_goon", "mafia_goon", "arsonist"],
		13: ["mafia_goon", "mafia_goon", "mafia_goon", "mafia_goon", "mafia_goon", "serial_killer"],
	},
}

module.exports = function (playing_config) {
	var logger = process.logger
	if (playing_config.roles) {
		logger.log(2, "[Primrose C9++] Not running setup randomiser as roles have been defined.")

		var override = { flavour: "primrose-c9++" }
		return lcn.auxils.objectOverride(playing_config, override)
	}

	var numbers = new Array()
	var letters = new Array()

	for (var i = 0; i < 13; i++) {
		var number = Math.ceil(lcn.auxils.cryptoRandom(100, 50) * 110)
		numbers.push(number)

		switch (true) {
			case number <= 40:
				letters.push("T")
				break

			case number > 40 && number <= 50:
				letters.push("W")
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

	var townies = new Array(26 - setup.length).fill("vanilla_townie")
	setup = setup.concat(townies)

	logger.log(2, "[Expanded Primrose C9++] Running setup: %s; rolled: %s", letters.join(""), numbers.join(", "))

	var override = {
		roles: setup,
		flavour: "primrose-c9++",
		generated: { numbers: numbers, letters: letters },
	}

	return lcn.auxils.objectOverride(playing_config, override)
}
