var lcn = require("../../../lcn")

module.exports = function (playing_config) {
	var logger = process.logger
	if (playing_config.roles) {
		logger.log(2, "[Viva La Revolución] Not running setup randomiser as roles have been defined.")

		var override = { flavour: "viva-la-revolucion" }
		return lcn.auxils.objectOverride(playing_config, override)
	}

	var setup = [
		"anarchist",
		"arsonist",
		"mafia_vigilante",
		"bombproof_bomb_defuser",
		"bulletproof_doctor",
		"fireproof_firefighter",
		"tracker",
		"vanilla_townie",
		"vanilla_townie",
		"vanilla_townie",
		"vanilla_townie",
		"vanilla_townie",
		"vanilla_townie",
	]

	logger.log(2, "[Viva La Revolución] Roles are running as per defined open setup.")

	var override = { roles: setup, flavour: "viva-la-revolucion" }

	return lcn.auxils.objectOverride(playing_config, override)
}